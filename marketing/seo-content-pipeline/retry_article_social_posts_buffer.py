#!/usr/bin/env python3
"""Retry/complete Buffer scheduling for article_social_schedule.csv.

Uses ~/.openclaw/.env BUFFER_ACCESS_TOKEN_SECONDARY privately. Does not print tokens.
Completes missing LinkedIn posts and missing X thread parts, with conservative backoff for Buffer rate limits.
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
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCHEDULE_CSV = ROOT / "article_social_schedule.csv"
TRACKING_CSV = ROOT / "article_distribution_tracking.csv"
RESULTS_JSON = ROOT / "article_social_buffer_retry_results.json"
ENV_FILE = Path.home() / ".openclaw" / ".env"
API_URL = "https://api.buffer.com/graphql"
LINKEDIN_CHANNEL_ID = "6a22ea8bc687a22dd463fb3c"
TWITTER_CHANNEL_ID = "6a22e501c687a22dd463d584"
TOKEN_ENV = "BUFFER_ACCESS_TOKEN_SECONDARY"
DELAY_SECONDS = float(os.environ.get("BUFFER_RETRY_DELAY_SECONDS", "7.5"))

MUTATION = """
mutation CreateScheduledPost($input: CreatePostInput!) {
  createPost(input: $input) {
    ... on PostActionSuccess { post { id text dueAt channelId status } }
    ... on MutationError { message }
  }
}
"""


def load_env() -> None:
    for line in ENV_FILE.read_text().splitlines():
        m = re.match(r"\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$", line)
        if m and m.group(1).startswith("BUFFER_"):
            os.environ.setdefault(m.group(1), m.group(2).strip().strip('"\''))


def gql(token: str, query: str, variables: dict) -> dict:
    body = json.dumps({"query": query, "variables": variables}).encode()
    req = urllib.request.Request(API_URL, data=body, headers={"Content-Type": "application/json", "Authorization": "Bearer " + token})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return json.loads(resp.read().decode())


def create_with_backoff(token: str, input_obj: dict, max_attempts: int = 8) -> tuple[dict | None, str | None]:
    for attempt in range(1, max_attempts + 1):
        try:
            resp = gql(token, MUTATION, {"input": input_obj})
            payload = resp.get("data", {}).get("createPost") if isinstance(resp, dict) else None
            if payload and payload.get("post", {}).get("id"):
                return payload["post"], None
            return None, json.dumps(resp)[:600]
        except urllib.error.HTTPError as exc:
            body = exc.read().decode(errors="replace")[:300]
            if exc.code == 429 and attempt < max_attempts:
                retry_after = exc.headers.get("Retry-After")
                wait = int(retry_after) if retry_after and retry_after.isdigit() else min(90, 25 * attempt)
                print(json.dumps({"event": "rate_limited", "attempt": attempt, "sleep_seconds": wait}), flush=True)
                time.sleep(wait)
                continue
            return None, f"HTTP {exc.code}: {body}"
        except Exception as exc:  # noqa: BLE001
            if attempt < max_attempts:
                wait = min(60, 10 * attempt)
                print(json.dumps({"event": "transient_error", "attempt": attempt, "sleep_seconds": wait, "type": type(exc).__name__}), flush=True)
                time.sleep(wait)
                continue
            return None, f"{type(exc).__name__}: {exc}"
    return None, "max_attempts_exhausted"


def due_base(value: str) -> tuple[datetime, bool]:
    raw = datetime.fromisoformat(value.replace("Z", "+00:00"))
    min_future = (datetime.now(timezone.utc) + timedelta(minutes=45)).replace(second=0, microsecond=0)
    adjusted = False
    if raw <= min_future:
        raw = min_future
        adjusted = True
    return raw.astimezone(timezone.utc), adjusted


def due_str(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def read_csv(path: Path) -> tuple[list[str], list[dict]]:
    with path.open(newline="") as f:
        r = csv.DictReader(f)
        return list(r.fieldnames or []), list(r)


def write_csv(path: Path, fields: list[str], rows: list[dict]) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    tmp.replace(path)


def main() -> int:
    load_env()
    token = os.environ.get(TOKEN_ENV)
    if not token:
        raise SystemExit(f"missing {TOKEN_ENV}")
    schedule_fields, rows = read_csv(SCHEDULE_CSV)
    tracking_fields, tracking_rows = read_csv(TRACKING_CSV)
    created = []
    errors = []

    for row in rows:
        existing = [x for x in row.get("social_post_id", "").split(";") if x]
        base, adjusted = due_base(row["scheduled_for_utc"])
        needed = []
        if row["platform"] == "linkedin":
            if len(existing) >= 1:
                continue
            needed.append((0, row["copy_or_thread_json"], LINKEDIN_CHANNEL_ID, base, None))
        elif row["platform"] == "x_twitter":
            tweets = json.loads(row["copy_or_thread_json"])
            for idx in range(len(existing), len(tweets)):
                text = f"{idx + 1}/{len(tweets)} {tweets[idx]}"
                needed.append((idx, text, TWITTER_CHANNEL_ID, base + timedelta(minutes=2 * idx), {"twitter": {"isAiGenerated": True}}))
        else:
            continue
        for idx, text, channel_id, due_at, metadata in needed:
            input_obj = {
                "text": text,
                "channelId": channel_id,
                "schedulingType": "automatic",
                "mode": "customScheduled",
                "dueAt": due_str(due_at),
                "assets": [],
                "source": "operive-seo-article-pipeline",
                "aiAssisted": True,
            }
            if metadata:
                input_obj["metadata"] = metadata
            post, err = create_with_backoff(token, input_obj)
            if post:
                existing.append(post["id"])
                created.append({"article_id": row["article_id"], "platform": row["platform"], "schedule_label": row["schedule_label"], "part_index": idx, "post_id": post["id"], "dueAt": post.get("dueAt"), "status": post.get("status"), "time_adjusted": adjusted})
                print(json.dumps({"created": len(created), "article_id": row["article_id"], "platform": row["platform"], "label": row["schedule_label"], "part": idx + 1}), flush=True)
            else:
                errors.append({"article_id": row["article_id"], "platform": row["platform"], "schedule_label": row["schedule_label"], "part_index": idx, "error": err})
                print(json.dumps({"error_count": len(errors), "article_id": row["article_id"], "platform": row["platform"], "label": row["schedule_label"], "part": idx + 1, "error": err}), flush=True)
                break
            time.sleep(DELAY_SECONDS)
        row["social_post_id"] = ";".join(existing)
        expected = 1 if row["platform"] == "linkedin" else len(json.loads(row["copy_or_thread_json"]))
        if len(existing) >= expected:
            row["status"] = "scheduled-buffer-confirmed" + ("-time-adjusted" if adjusted else "")
        elif existing:
            row["status"] = "partial-buffer-scheduled-see-results"
        else:
            row["status"] = "buffer-schedule-failed-see-results"
        write_csv(SCHEDULE_CSV, schedule_fields, rows)

    ids = defaultdict(list)
    for row in rows:
        key = (row["article_id"], row["schedule_label"], row["platform"])
        ids[key] = [x for x in row.get("social_post_id", "").split(";") if x]
    for tr in tracking_rows:
        aid = tr["article_id"]
        tr["linkedin_publish_day_post_id"] = ";".join(ids[(aid, "publish_day", "linkedin")])
        tr["linkedin_day_after_post_id"] = ";".join(ids[(aid, "day_after", "linkedin")])
        tr["twitter_publish_day_thread_id"] = ";".join(ids[(aid, "publish_day", "x_twitter")])
        tr["twitter_day_after_thread_id"] = ";".join(ids[(aid, "day_after", "x_twitter")])
        complete = all(tr.get(c) for c in ["linkedin_publish_day_post_id", "linkedin_day_after_post_id", "twitter_publish_day_thread_id", "twitter_day_after_thread_id"])
        if complete:
            tr["social_schedule_status"] = "scheduled-buffer-confirmed"
            tr["notes"] = (tr.get("notes") or "").replace("social/GSC require credentials before IDs/timestamps can be recorded.", "social scheduled via Buffer; GSC still requires Search Console indexing access.")
    write_csv(TRACKING_CSV, tracking_fields, tracking_rows)

    status_counts = Counter(r["status"] for r in rows)
    summary = {
        "ran_at_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "new_created_count": len(created),
        "error_count": len(errors),
        "schedule_rows_with_ids": sum(bool(r.get("social_post_id")) for r in rows),
        "status_counts": dict(status_counts),
        "tracking_rows_social_complete": sum(r.get("social_schedule_status") == "scheduled-buffer-confirmed" for r in tracking_rows),
        "created": created,
        "errors": errors,
    }
    RESULTS_JSON.write_text(json.dumps(summary, indent=2))
    print(json.dumps({k: v for k, v in summary.items() if k not in {"created", "errors"}}, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
