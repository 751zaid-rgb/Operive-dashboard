#!/usr/bin/env python3
"""Operive DFW lead monitor.

No external outreach is sent by this script. It collects public DFW business signals,
deduplicates against leads.csv, scores fit for Operive AI workflow automation, writes a
local dashboard, and prepares a weekly digest. Airtable/Notion/SMTP exports are
credential-aware: if environment variables are absent, the script records that status
instead of failing.
"""
from __future__ import annotations

import csv
import datetime as dt
import hashlib
import html
import json
import os
import re
import sqlite3
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parent
LEADS_CSV = ROOT / "leads.csv"
SIGNALS_CSV = ROOT / "signals.csv"
DASHBOARD = ROOT / "dashboard.html"
DIGEST = ROOT / "weekly_digest.md"
STATE_DB = ROOT / "lead_monitor.sqlite3"
INTEGRATION_STATUS = ROOT / "integrations_status.json"
USER_AGENT = "OperiveLeadMonitor/1.0 (+https://www.operive.com)"
TODAY = dt.date.today().isoformat()

FIELDNAMES = [
    "discovered_at",
    "business_name_or_signal",
    "segment",
    "url",
    "signal",
    "qualification_score",
    "recommended_angle",
    "verification_needed",
    "outreach_status",
]

DFW_TERMS = ["dallas", "fort worth", "dfw", "plano", "frisco", "arlington", "irving", "richardson", "north texas"]
SEGMENTS = {
    "home services": ["hvac", "plumb", "roof", "garage", "electric", "restoration", "repair", "contractor"],
    "restaurant/catering": ["restaurant", "catering", "event", "private dining", "hospitality"],
    "healthcare": ["dental", "clinic", "patient", "medical", "therapy", "med spa", "aesthetic"],
    "logistics/manufacturing": ["logistics", "warehouse", "manufacturing", "industrial", "supply chain", "facility"],
    "professional services": ["accounting", "law", "consulting", "insurance", "finance", "real estate"],
}
SIGNAL_TERMS = [
    "hiring", "expansion", "opening", "new office", "relocation", "front desk", "dispatcher", "intake",
    "customer service", "appointment", "booking", "quote", "estimate", "emergency", "after hours", "automation",
    "workflow", "ai", "technology", "digital", "operations", "growth",
]

SEARCH_QUERIES = [
    "Dallas Fort Worth business expansion hiring operations automation",
    "Dallas company hiring front desk dispatcher customer service",
    "Fort Worth business expansion new office hiring operations",
    "DFW logistics manufacturing expansion hiring operations",
    "Dallas healthcare clinic hiring patient intake front desk",
    "Fort Worth restaurant catering private event inquiry hiring",
    "Dallas HVAC plumbing roofing dispatcher hiring emergency service",
    "Dallas professional services firm expansion operations technology",
]

DIRECTORY_URLS = [
    "https://business.fortworthchamber.com/list/search?sa=true&o=alpha",
    "https://business.fortworthchamber.com/list/searchalpha/a",
    "https://www.dallaschamber.org/member-directory/",
    "https://dallasinnovates.com/category/relocation-and-expansion/",
    "https://dallasinnovates.com/business/",
]

@dataclass
class Signal:
    source: str
    title: str
    url: str
    summary: str
    fetched_at: str

@dataclass
class Lead:
    discovered_at: str
    business_name_or_signal: str
    segment: str
    url: str
    signal: str
    qualification_score: int
    recommended_angle: str
    verification_needed: str
    outreach_status: str = "not_contacted"


def fetch_url(url: str, timeout: int = 15) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read(2_000_000)
    return raw.decode("utf-8", errors="replace")


def clean_text(s: str) -> str:
    s = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>", " ", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def google_news_signals() -> list[Signal]:
    out: list[Signal] = []
    for query in SEARCH_QUERIES:
        q = urllib.parse.quote_plus(query)
        url = f"https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en"
        try:
            xml = fetch_url(url)
            root = ET.fromstring(xml)
            for item in root.findall(".//item")[:8]:
                title = clean_text(item.findtext("title") or "")
                link = item.findtext("link") or url
                desc = clean_text(item.findtext("description") or "")
                out.append(Signal("google_news_rss", title, link, desc, dt.datetime.now().isoformat(timespec="seconds")))
        except Exception as e:
            out.append(Signal("google_news_rss_error", query, url, f"fetch_error: {e}", dt.datetime.now().isoformat(timespec="seconds")))
        time.sleep(0.2)
    return out


def directory_signals() -> list[Signal]:
    out: list[Signal] = []
    for url in DIRECTORY_URLS:
        try:
            page = fetch_url(url)
            text = clean_text(page)
            # Keep the first chunks with likely company/member names; directory pages are noisy.
            chunks = re.split(r"(?<=[.!?])\s+|\s{2,}", text)
            candidates = [c for c in chunks if 25 <= len(c) <= 220]
            for c in candidates[:20]:
                if any(term in c.lower() for term in DFW_TERMS + list(sum(SEGMENTS.values(), [])) + SIGNAL_TERMS):
                    out.append(Signal("directory_or_local_page", c[:100], url, c[:500], dt.datetime.now().isoformat(timespec="seconds")))
        except Exception as e:
            out.append(Signal("directory_error", url, url, f"fetch_error: {e}", dt.datetime.now().isoformat(timespec="seconds")))
        time.sleep(0.3)
    return out


def infer_segment(text: str) -> str:
    low = text.lower()
    best = ("local services", 0)
    for segment, terms in SEGMENTS.items():
        score = sum(1 for t in terms if t in low)
        if score > best[1]:
            best = (segment, score)
    return best[0]


def score_signal(text: str, segment: str) -> int:
    low = text.lower()
    score = 0
    if any(t in low for t in DFW_TERMS):
        score += 3
    if segment != "local services":
        score += 3
    if any(t in low for t in ["appointment", "booking", "quote", "estimate", "contact", "form", "phone", "call"]):
        score += 2
    if any(t in low for t in SIGNAL_TERMS):
        score += 2
    if any(t in low for t in ["hiring", "expansion", "new office", "growth", "emergency", "after hours"]):
        score += 1
    return min(score, 12)


def angle_for(segment: str, text: str) -> str:
    low = text.lower()
    if "emergency" in low or "after hours" in low or "dispatcher" in low:
        return "After-hours AI intake and missed-call recovery with human dispatch handoff."
    if "catering" in low or "event" in low or "restaurant" in low:
        return "Event/private-dining inquiry qualification and follow-up workflow."
    if "dental" in low or "patient" in low or "clinic" in low or "med spa" in low:
        return "Patient/consultation intake automation with reminder and booking handoff."
    if "hiring" in low or "front desk" in low or "customer service" in low:
        return "Reduce front-desk/customer-service load with AI triage, capture, and routing."
    if "expansion" in low or "new office" in low or "growth" in low:
        return "Expansion-ready workflow automation for intake, routing, and follow-up before volume spikes."
    return "AI Front Desk / customer intake workflow to capture, qualify, and route leads faster."


def business_name(title: str) -> str:
    title = re.sub(r"\s[-|].*$", "", title)
    title = re.sub(r"\b(announces|opens|expands|hiring|job|jobs|in Dallas|in Fort Worth).*$", "", title, flags=re.I)
    return title.strip()[:120] or "DFW business signal"


def signal_to_lead(sig: Signal) -> Lead | None:
    text = f"{sig.title} {sig.summary}"
    low = text.lower()
    if sig.source.endswith("_error"):
        return None
    if not any(t in low for t in DFW_TERMS):
        return None
    if not any(t in low for t in SIGNAL_TERMS + list(sum(SEGMENTS.values(), []))):
        return None
    segment = infer_segment(text)
    score = score_signal(text, segment)
    if score < 7:
        return None
    return Lead(
        discovered_at=TODAY,
        business_name_or_signal=business_name(sig.title),
        segment=segment,
        url=sig.url,
        signal=(sig.summary or sig.title)[:500],
        qualification_score=score,
        recommended_angle=angle_for(segment, text),
        verification_needed="Browser-verify current website/contact path, DFW location, company size 10-500, and decision-maker before outreach.",
    )


def dedupe_key(url: str, name: str) -> str:
    canonical = re.sub(r"[?#].*$", "", url).strip().lower()
    name_norm = re.sub(r"\W+", "", name.lower())
    return hashlib.sha1(f"{canonical}|{name_norm}".encode()).hexdigest()[:16]


def read_existing() -> list[Lead]:
    if not LEADS_CSV.exists():
        return []
    rows: list[Lead] = []
    with LEADS_CSV.open(newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if not r:
                continue
            rows.append(Lead(
                discovered_at=r.get("discovered_at", ""),
                business_name_or_signal=r.get("business_name_or_signal", ""),
                segment=r.get("segment", ""),
                url=r.get("url", ""),
                signal=r.get("signal", ""),
                qualification_score=int(r.get("qualification_score") or 0),
                recommended_angle=r.get("recommended_angle", ""),
                verification_needed=r.get("verification_needed", ""),
                outreach_status=r.get("outreach_status", "not_contacted"),
            ))
    return rows


def write_leads(leads: list[Lead]) -> None:
    leads = sorted(leads, key=lambda x: (x.outreach_status != "not_contacted", -x.qualification_score, x.discovered_at, x.business_name_or_signal))
    with LEADS_CSV.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDNAMES, lineterminator="\n")
        w.writeheader()
        for lead in leads:
            w.writerow(asdict(lead))


def write_signals(signals: list[Signal]) -> None:
    exists = SIGNALS_CSV.exists()
    with SIGNALS_CSV.open("a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["fetched_at", "source", "title", "url", "summary"])
        if not exists:
            w.writeheader()
        for s in signals:
            w.writerow({"fetched_at": s.fetched_at, "source": s.source, "title": s.title, "url": s.url, "summary": s.summary})


def sync_sqlite(leads: list[Lead], signals: list[Signal]) -> None:
    con = sqlite3.connect(STATE_DB)
    con.execute("""CREATE TABLE IF NOT EXISTS leads (
        key TEXT PRIMARY KEY, discovered_at TEXT, name TEXT, segment TEXT, url TEXT, signal TEXT,
        score INTEGER, angle TEXT, verification_needed TEXT, outreach_status TEXT, updated_at TEXT
    )""")
    con.execute("""CREATE TABLE IF NOT EXISTS runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT, ran_at TEXT, signals_seen INTEGER, leads_total INTEGER
    )""")
    for lead in leads:
        k = dedupe_key(lead.url, lead.business_name_or_signal)
        con.execute("""INSERT INTO leads VALUES (?,?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(key) DO UPDATE SET score=excluded.score, signal=excluded.signal, angle=excluded.angle, updated_at=excluded.updated_at""",
            (k, lead.discovered_at, lead.business_name_or_signal, lead.segment, lead.url, lead.signal, lead.qualification_score, lead.recommended_angle, lead.verification_needed, lead.outreach_status, dt.datetime.now().isoformat(timespec="seconds")))
    con.execute("INSERT INTO runs (ran_at, signals_seen, leads_total) VALUES (?,?,?)", (dt.datetime.now().isoformat(timespec="seconds"), len(signals), len(leads)))
    con.commit(); con.close()


def integration_status() -> dict:
    required = {
        "airtable": ["AIRTABLE_TOKEN", "AIRTABLE_BASE_ID", "AIRTABLE_TABLE_NAME"],
        "notion": ["NOTION_TOKEN", "NOTION_DATABASE_ID"],
        "weekly_email_smtp": ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "DIGEST_TO_EMAIL"],
    }
    status = {}
    for name, keys in required.items():
        status[name] = {"configured": all(os.getenv(k) for k in keys), "missing": [k for k in keys if not os.getenv(k)]}
    status["note"] = "Missing credentials are non-fatal; local CSV/SQLite/dashboard/digest remain active."
    INTEGRATION_STATUS.write_text(json.dumps(status, indent=2), encoding="utf-8")
    return status


def write_dashboard(leads: list[Lead], status: dict) -> None:
    total = len(leads)
    qualified = sum(1 for l in leads if l.qualification_score >= 10)
    segments = {}
    for l in leads:
        segments[l.segment] = segments.get(l.segment, 0) + 1
    rows = "\n".join(
        f"<tr><td>{html.escape(l.discovered_at)}</td><td>{html.escape(l.business_name_or_signal)}</td><td>{html.escape(l.segment)}</td><td>{l.qualification_score}</td><td><a href='{html.escape(l.url)}'>source</a></td><td>{html.escape(l.recommended_angle)}</td><td>{html.escape(l.outreach_status)}</td></tr>"
        for l in leads[:100]
    )
    DASHBOARD.write_text(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Operive DFW Lead Monitor</title>
<style>body{{font-family:Inter,system-ui,sans-serif;margin:2rem;background:#f8faff;color:#111827}}.cards{{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1rem}}.card,table{{background:white;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 10px 30px #0001}}.card{{padding:1rem}}table{{width:100%;border-collapse:collapse;margin-top:1rem;overflow:hidden}}td,th{{padding:.75rem;border-bottom:1px solid #e5e7eb;text-align:left;vertical-align:top}}th{{background:#eef2ff}}a{{color:#1f3bff;font-weight:700}}</style></head><body>
<h1>Operive DFW Lead Monitor</h1><p>Last run: {dt.datetime.now().isoformat(timespec='seconds')} · No external outreach sent.</p>
<div class="cards"><div class="card"><h2>{total}</h2><p>Total deduped leads</p></div><div class="card"><h2>{qualified}</h2><p>Score ≥10 prospects</p></div><div class="card"><h2>{html.escape(json.dumps(segments))}</h2><p>Segment mix</p></div><div class="card"><h2>{'on' if status['airtable']['configured'] or status['notion']['configured'] else 'local'}</h2><p>CRM mode</p></div></div>
<h2>Review queue</h2><table><thead><tr><th>Date</th><th>Lead/signal</th><th>Segment</th><th>Score</th><th>URL</th><th>Angle</th><th>Status</th></tr></thead><tbody>{rows}</tbody></table>
</body></html>""", encoding="utf-8")


def write_digest(leads: list[Lead], new_count: int, status: dict) -> None:
    top = sorted(leads, key=lambda l: -l.qualification_score)[:10]
    lines = [
        "# Operive DFW lead monitor weekly digest",
        "",
        f"Generated: {dt.datetime.now().isoformat(timespec='seconds')}",
        f"Total deduped leads: {len(leads)}",
        f"New leads this run: {new_count}",
        f"Score >= 10 leads: {sum(1 for l in leads if l.qualification_score >= 10)}",
        "",
        "## Integration status",
        f"- Airtable configured: {status['airtable']['configured']}",
        f"- Notion configured: {status['notion']['configured']}",
        f"- SMTP weekly email configured: {status['weekly_email_smtp']['configured']}",
        "",
        "## Top review queue",
    ]
    for l in top:
        lines.append(f"- Score {l.qualification_score}: {l.business_name_or_signal} ({l.segment}) — {l.recommended_angle} — {l.url}")
    lines.extend([
        "",
        "## CEO approval needed before outreach",
        "Approve specific recipient/company/channel copy before any email, LinkedIn, or phone outreach is sent.",
    ])
    DIGEST.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    signals = google_news_signals() + directory_signals()
    write_signals(signals)
    existing = read_existing()
    seen = {dedupe_key(l.url, l.business_name_or_signal) for l in existing}
    added = []
    for sig in signals:
        lead = signal_to_lead(sig)
        if not lead:
            continue
        k = dedupe_key(lead.url, lead.business_name_or_signal)
        if k not in seen:
            seen.add(k); added.append(lead)
    leads = existing + added
    write_leads(leads)
    sync_sqlite(leads, signals)
    status = integration_status()
    write_dashboard(leads, status)
    write_digest(leads, len(added), status)
    print(json.dumps({
        "status": "ok",
        "signals_seen": len(signals),
        "new_leads": len(added),
        "total_leads": len(leads),
        "dashboard": str(DASHBOARD),
        "digest": str(DIGEST),
        "integrations": status,
    }, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
