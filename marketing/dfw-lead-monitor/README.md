# DFW AI workflow lead monitor

Runs every 6 hours to find Dallas-Fort Worth businesses signaling need for Operive AI workflow automation. No external outreach is sent without CEO approval.

## Inputs

- `seed_queries.csv` — original commercial-intent seed query list.
- `alert_queries.md` — exact Google Alerts, Talkwalker Alerts, LinkedIn Sales Navigator, Crunchbase, and Apollo query/filter recipes.
- Public local/news/directory sources embedded in `lead_monitor.py`:
  - Google News RSS searches for DFW expansion/hiring/automation terms
  - Fort Worth Chamber directory pages
  - Dallas Chamber member directory page
  - Dallas Innovates business / relocation-expansion pages

## Outputs

- `leads.csv` — deduped qualified prospect/signals queue.
- `signals.csv` — raw source signals from each run.
- `lead_monitor.sqlite3` — persistent local state for dashboard/reporting.
- `dashboard.html` — local monitoring dashboard with total leads, score >=10 count, segment mix, and review queue.
- `weekly_digest.md` — weekly digest-ready summary. If SMTP credentials are configured later, this becomes the email body source.
- `integrations_status.json` — whether Airtable, Notion, and weekly email credentials are available.
- `generate_outreach_assets.py` — builds approval-safe outreach sequences, CRM import queue, and outreach dashboard from `leads.csv`.
- `outreach_sequences.md` — persona-specific 3-step email + LinkedIn sequences and personalized first-touch drafts.
- `outreach_plan.csv` — 20 first-week personalized touches staged for CEO approval.
- `crm_import_outreach_queue.csv` — HubSpot/Pipedrive import-ready queue.
- `outreach_dashboard.html` — local outreach dashboard for sends, opens, replies, and meetings booked.
- `case_study_one_pager.md` — approval-safe one-page proof asset draft.

## Run manually

```bash
cd /Users/zaidai/Operive-dashboard/marketing/dfw-lead-monitor
python3 lead_monitor.py
open dashboard.html
```

## Scheduled job

Hermes cron job `5180a07775ad` runs every 6 hours from `/Users/zaidai/Operive-dashboard`.

## Qualification score

- +3 DFW-local business signal
- +3 ICP segment fit: restaurant/catering, home services, healthcare, professional services, logistics/manufacturing
- +2 visible phone/form/booking/contact workflow signal
- +2 operational pain signal: hiring, intake, customer service, booking, quote, emergency, after-hours, automation, expansion
- +1 growth/urgent signal: hiring, expansion, new office, emergency, after-hours

Target review threshold: score >=10.

## Airtable / Notion / email setup

The monitor is credential-aware and does not fail when secrets are missing. To activate external sync later, set:

Airtable:
- `AIRTABLE_TOKEN`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME`

Notion:
- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

Weekly digest email:
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `DIGEST_TO_EMAIL`

Until these are present, the active dashboard is local CSV + SQLite + `dashboard.html`, and the digest is written to `weekly_digest.md`.

## Sales boundary

All outreach stays `not_contacted` until Dr. Z approves recipients, channel, and copy. Use `outreach_drafts.md` as drafts only.
