#!/usr/bin/env python3
"""Schedule approved Operive SEO article social distribution through Buffer.

Reads:
  - article_social_schedule.csv
  - legacy local Buffer tokens from ~/.openclaw/.env (not printed or persisted)

Writes:
  - article_social_schedule.csv with Buffer post IDs/statuses
  - article_distribution_tracking.csv social ID/status fields
  - article_social_buffer_results.json summary/result manifest

Idempotent: rows with existing social_post_id are skipped.
"""
from __future__ import annotations

import csv
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCHEDULE_CSV = ROOT / "article_social_schedule.csv"
TRACKING_CSV = ROOT / "article_distribution_tracking.csv"
RESULTS_JSON = ROOT / "article_social_buffer_results.json"
ENV_FILE = Path.home() / ".openclaw" / ".env"
API_URL = "https://api.buffer.com/graphql"
LINKEDIN_CHANNEL_ID = "6a22ea8bc687a22dd463fb3c"
TWITTER_CHANNEL_ID = "6a22e501c687a22dd463d584"
ORG_ID = "6a22e2c167c8277e8dc5f98e"
TOKEN_ENV = "BUFFER_ACCESS_TOKEN_SECONDARY"

MUTATION = """
mutation CreateScheduledPost($input: CreatePostInput!) {
  createPost(input: $input) {
    ... on PostActionSuccess {
      post { id text dueAt channelId status }
    }
    ... on MutationError { message }
  }
}
"""

VERIFY_QUERY = """
query($org: OrganizationId!) {
  posts(first: 100, input: { organizationId: $org, filter: { status: [scheduled] } }) {
    edges { node { id dueAt channelId status text } }
  }
}
"""


def load_env() -> None:
    if not ENV_FILE.exists():
        raise SystemExit(f"missing env file: {ENV_FILE}")
    for line in ENV_FILE.read_text().splitlines():
        m = re.match(r"\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$", line)
        if not m:
            continue
        key, val = m.group(1), m.group(2).strip().strip('"\'')
        if key.startswith("BUFFER_") and key not in os.environ:
            os.environ[key] = val


def gql(token: str, query: str, variables: dict) -> dict:
    body = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=body,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
    )
    with urllib.request.urlopen(req, timeout=45) as resp:
        return json.loads(resp.read().decode("utf-8"))


def create_post(token: str, *, channel_id: str, text: str, due_at: str, metadata: dict | None = None) -> dict:
    input_obj = {
        "text": text,
        "channelId": channel_id,
        "schedulingType": "automatic",
        "mode": "customScheduled",
        "dueAt": due_at,
        "assets": [],
        "source": "operive-seo-article-pipeline",
        "aiAssisted": True,
    }
    if metadata:
        input_obj["metadata"] = metadata
    return gql(token, MUTATION, {"input": input_obj})


def to_buffer_due_at(value: str, min_future: datetime) -> tuple[str, bool]:
    raw = datetime.fromisoformat(value.replace("Z", "+00:00"))
    adjusted = False
    if raw <= min_future:
        raw = min_future
        adjusted = True
    return raw.astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"), adjusted


def read_csv(path: Path) -> tuple[list[str], list[dict]]:
    with path.open(newline="") as f:
        reader = csv.DictReader(f)
        return list(reader.fieldnames or []), list(reader)


def write_csv(path: Path, fields: list[str], rows: list[dict]) -> None:
    with path.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    load_env()
    token = os.environ.get(TOKEN_ENV)
    if not token:
        raise SystemExit(f"missing {TOKEN_ENV}")

    schedule_fields, rows = read_csv(SCHEDULE_CSV)
    tracking_fields, tracking_rows = read_csv(TRACKING_CSV)
    now = datetime.now(timezone.utc)
    min_future = (now + timedelta(minutes=45)).replace(second=0, microsecond=0)

    results: list[dict] = []
    errors: list[dict] = []
    ids_by_article_label_platform: dict[tuple[str, str, str], list[str]] = defaultdict(list)

    for row in rows:
        if row.get("social_post_id"):
            ids_by_article_label_platform[(row["article_id"], row["schedule_label"], row["platform"])].extend(row["social_post_id"].split(";"))
            continue
        due_at, adjusted = to_buffer_due_at(row["scheduled_for_utc"], min_future)
        platform = row["platform"]
        if platform == "linkedin":
            posts_to_create = [(row["copy_or_thread_json"], due_at, LINKEDIN_CHANNEL_ID, None, "linkedin")]
        elif platform == "x_twitter":
            tweets = json.loads(row["copy_or_thread_json"])
            base_dt = datetime.fromisoformat(due_at.replace("Z", "+00:00"))
            posts_to_create = []
            for idx, tweet in enumerate(tweets, start=1):
                tweet_due = (base_dt + timedelta(minutes=2 * (idx - 1))).astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
                text = f"{idx}/{len(tweets)} {tweet}"
                posts_to_create.append((text, tweet_due, TWITTER_CHANNEL_ID, {"twitter": {"isAiGenerated": True}}, f"x_twitter_{idx}"))
        else:
            errors.append({"article_id": row["article_id"], "platform": platform, "error": "unsupported platform"})
            continue

        created_ids: list[str] = []
        for text, post_due_at, channel_id, metadata, part in posts_to_create:
            try:
                resp = create_post(token, channel_id=channel_id, text=text, due_at=post_due_at, metadata=metadata)
            except urllib.error.HTTPError as exc:
                body = exc.read().decode("utf-8", errors="replace")[:500]
                errors.append({"article_id": row["article_id"], "platform": platform, "part": part, "http_error": exc.code, "body": body})
                continue
            except Exception as exc:  # noqa: BLE001
                errors.append({"article_id": row["article_id"], "platform": platform, "part": part, "error": f"{type(exc).__name__}: {exc}"})
                continue
            payload = resp.get("data", {}).get("createPost") if isinstance(resp, dict) else None
            if payload and payload.get("post", {}).get("id"):
                post = payload["post"]
                created_ids.append(post["id"])
                results.append({
                    "article_id": row["article_id"],
                    "schedule_label": row["schedule_label"],
                    "platform": platform,
                    "part": part,
                    "post_id": post["id"],
                    "dueAt": post.get("dueAt"),
                    "channelId": post.get("channelId"),
                    "status": post.get("status"),
                    "past_time_adjusted": adjusted,
                })
            else:
                errors.append({"article_id": row["article_id"], "platform": platform, "part": part, "response": resp})
            time.sleep(0.15)
        if created_ids and len(created_ids) == len(posts_to_create):
            row["social_post_id"] = ";".join(created_ids)
            row["status"] = "scheduled-buffer-confirmed" + ("-time-adjusted" if adjusted else "")
            ids_by_article_label_platform[(row["article_id"], row["schedule_label"], platform)].extend(created_ids)
        elif created_ids:
            row["social_post_id"] = ";".join(created_ids)
            row["status"] = "partial-buffer-scheduled-see-results"
        else:
            row["status"] = "buffer-schedule-failed-see-results"

    for tr in tracking_rows:
        aid = tr["article_id"]
        tr["linkedin_publish_day_post_id"] = ";".join(ids_by_article_label_platform.get((aid, "publish_day", "linkedin"), []))
        tr["linkedin_day_after_post_id"] = ";".join(ids_by_article_label_platform.get((aid, "day_after", "linkedin"), []))
        tr["twitter_publish_day_thread_id"] = ";".join(ids_by_article_label_platform.get((aid, "publish_day", "x_twitter"), []))
        tr["twitter_day_after_thread_id"] = ";".join(ids_by_article_label_platform.get((aid, "day_after", "x_twitter"), []))
        social_complete = all(tr.get(col) for col in [
            "linkedin_publish_day_post_id", "linkedin_day_after_post_id", "twitter_publish_day_thread_id", "twitter_day_after_thread_id"
        ])
        if social_complete:
            tr["social_schedule_status"] = "scheduled-buffer-confirmed"
            note = tr.get("notes", "")
            tr["notes"] = note.replace("social/GSC require credentials before IDs/timestamps can be recorded.", "social scheduled via Buffer; GSC still requires Search Console indexing access.")

    write_csv(SCHEDULE_CSV, schedule_fields, rows)
    write_csv(TRACKING_CSV, tracking_fields, tracking_rows)

    verify = gql(token, VERIFY_QUERY, {"org": ORG_ID})
    scheduled_edges = verify.get("data", {}).get("posts", {}).get("edges", [])
    scheduled_ids = {edge["node"]["id"] for edge in scheduled_edges}
    result_ids = [r["post_id"] for r in results]
    verified_result_ids_visible = sum(1 for pid in result_ids if pid in scheduled_ids)

    summary = {
        "ran_at_utc": now.isoformat(timespec="seconds"),
        "created_count": len(results),
        "error_count": len(errors),
        "linkedin_posts_created": sum(1 for r in results if r["platform"] == "linkedin"),
        "twitter_posts_created": sum(1 for r in results if r["platform"] == "x_twitter"),
        "twitter_thread_rows_scheduled": sum(1 for row in rows if row["platform"] == "x_twitter" and row.get("social_post_id")),
        "schedule_rows_with_ids": sum(1 for row in rows if row.get("social_post_id")),
        "tracking_rows_social_complete": sum(1 for row in tracking_rows if row.get("social_schedule_status") == "scheduled-buffer-confirmed"),
        "scheduled_posts_visible_first_page": len(scheduled_edges),
        "created_ids_visible_first_page": verified_result_ids_visible,
        "errors": errors,
        "results": results,
    }
    RESULTS_JSON.write_text(json.dumps(summary, indent=2))
    print(json.dumps({k: v for k, v in summary.items() if k not in {"results", "errors"}}, indent=2))
    if errors:
        print(json.dumps({"errors_sample": errors[:5]}, indent=2), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
