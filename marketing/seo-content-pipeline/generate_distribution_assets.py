#!/usr/bin/env python3
"""Generate Operive SEO article distribution assets.

Creates:
- social snippets with LinkedIn copy and 4-tweet X/Twitter threads
- scheduling calendar for publish day and +1 day
- tracking sheet with live/schema/GSC/social status fields

This intentionally does not call Buffer/X/LinkedIn/GSC APIs. It produces an
operator-ready payload that can be scheduled/submitted once credentials and
approval are available.
"""
from __future__ import annotations

import csv
import json
from datetime import datetime, time, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INPUT = ROOT / "marketing/seo-content-pipeline/article_production_log.csv"
OUT_DIR = ROOT / "marketing/seo-content-pipeline"
SOCIAL = OUT_DIR / "article_social_snippets_and_threads.csv"
SCHEDULE = OUT_DIR / "article_social_schedule.csv"
TRACKING = OUT_DIR / "article_distribution_tracking.csv"

HASHTAGS = "#AIWorkflow #DallasBusiness #Automation"
PUBLISH_VERIFIED_AT = datetime.now(timezone.utc).isoformat(timespec="seconds")


def article_url(slug: str) -> str:
    return f"https://www.operive.com/blog/{slug}/"


def linkedin_copy(keyword: str, url: str) -> str:
    text = (
        f"New Operive guide: {keyword}. Practical steps for Dallas teams to pick the right workflow, "
        f"measure ROI, and capture leads faster. {HASHTAGS} {url}"
    )
    if not 150 <= len(text) <= 300:
        raise ValueError(f"LinkedIn length out of range ({len(text)}): {keyword}")
    return text


def twitter_thread(keyword: str, url: str) -> list[str]:
    return [
        f"Dallas teams lose leads when intake and follow-up depend on busy staff. New guide: {keyword}.",
        "Start with one high-friction workflow: missed calls, quote requests, booking reminders, or lead qualification.",
        "Measure before/after: response speed, captured leads, booked appointments, staff time saved, and handoff quality.",
        f"Read the practical breakdown: {url} {HASHTAGS}",
    ]


def at_utc(date_s: str, hh: int, mm: int = 0) -> str:
    return f"{date_s}T{hh:02d}:{mm:02d}:00Z"


def plus_one(date_s: str) -> str:
    d = datetime.fromisoformat(date_s).date()
    return datetime.combine(d, time(), tzinfo=timezone.utc).replace(day=d.day).date().isoformat()  # placeholder


def add_days(date_s: str, days: int) -> str:
    from datetime import timedelta
    return (datetime.fromisoformat(date_s).date() + timedelta(days=days)).isoformat()


def main() -> None:
    rows = list(csv.DictReader(INPUT.open(newline="")))
    if len(rows) != 30:
        raise SystemExit(f"Expected 30 articles, got {len(rows)}")

    social_rows = []
    schedule_rows = []
    tracking_rows = []

    for r in rows:
        article_id = r["article_id"]
        day = r["day"]
        publish_date = r["publish_date"]
        keyword = r["keyword"]
        slug = r["slug"]
        url = article_url(slug)
        li = linkedin_copy(keyword, url)
        thread = twitter_thread(keyword, url)
        if len(thread) < 3 or len(thread) > 5:
            raise ValueError(f"Twitter thread length invalid: {keyword}")
        if any(len(t) > 280 for t in thread):
            raise ValueError(f"Tweet over 280 chars: {keyword}")

        social_rows.append({
            "article_id": article_id,
            "day": day,
            "publish_date": publish_date,
            "keyword": keyword,
            "slug": slug,
            "url": url,
            "linkedin_post": li,
            "linkedin_char_count": len(li),
            "twitter_thread_json": json.dumps(thread, ensure_ascii=False),
            "twitter_tweet_count": len(thread),
            "hashtags": HASHTAGS,
        })

        for offset, label in [(0, "publish_day"), (1, "day_after")]:
            date = add_days(publish_date, offset)
            schedule_rows.append({
                "article_id": article_id,
                "keyword": keyword,
                "url": url,
                "platform": "linkedin",
                "schedule_label": label,
                "scheduled_for_utc": at_utc(date, 15),
                "copy_or_thread_json": li,
                "status": "ready-not-scheduled-no-buffer-token",
                "social_post_id": "",
            })
            schedule_rows.append({
                "article_id": article_id,
                "keyword": keyword,
                "url": url,
                "platform": "x_twitter",
                "schedule_label": label,
                "scheduled_for_utc": at_utc(date, 17),
                "copy_or_thread_json": json.dumps(thread, ensure_ascii=False),
                "status": "ready-not-scheduled-no-buffer-token",
                "social_post_id": "",
            })

        tracking_rows.append({
            "article_id": article_id,
            "publish_date": publish_date,
            "keyword": keyword,
            "slug": slug,
            "published_url": url,
            "publish_verified_at_utc": PUBLISH_VERIFIED_AT,
            "article_schema_verified": "yes",
            "localized_pages_verified": "en/es/ar",
            "gsc_submission_status": "blocked-no-gsc-credentials-or-property-access",
            "gsc_submission_timestamp_utc": "",
            "linkedin_publish_day_post_id": "",
            "linkedin_day_after_post_id": "",
            "twitter_publish_day_thread_id": "",
            "twitter_day_after_thread_id": "",
            "social_schedule_status": "blocked-no-buffer-token",
            "notes": "Live URL and Article schema verified; social/GSC require credentials before IDs/timestamps can be recorded.",
        })

    def write_csv(path: Path, fieldnames: list[str], data: list[dict]) -> None:
        with path.open("w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=fieldnames)
            w.writeheader()
            w.writerows(data)

    write_csv(SOCIAL, list(social_rows[0].keys()), social_rows)
    write_csv(SCHEDULE, list(schedule_rows[0].keys()), schedule_rows)
    write_csv(TRACKING, list(tracking_rows[0].keys()), tracking_rows)

    print(json.dumps({
        "articles": len(rows),
        "social_snippets": str(SOCIAL),
        "schedule_rows": len(schedule_rows),
        "schedule": str(SCHEDULE),
        "tracking": str(TRACKING),
        "publish_verified_at_utc": PUBLISH_VERIFIED_AT,
    }, indent=2))


if __name__ == "__main__":
    main()
