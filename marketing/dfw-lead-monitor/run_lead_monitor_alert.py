#!/usr/bin/env python3
"""Cron wrapper for Telegram-safe lead-monitor alerts.

Runs lead_monitor.py every tick. Prints only when new leads are found, so Hermes
no_agent cron stays silent on no-change ticks. Errors propagate for scheduler alerts.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
proc = subprocess.run([sys.executable, str(HERE / "lead_monitor.py")], cwd=HERE.parents[1], text=True, capture_output=True)
if proc.returncode != 0:
    sys.stderr.write(proc.stderr or proc.stdout)
    raise SystemExit(proc.returncode)
try:
    payload = json.loads(proc.stdout)
except Exception:
    print(proc.stdout.strip())
    raise SystemExit(0)
new_leads = int(payload.get("new_leads") or 0)
total = int(payload.get("total_leads") or 0)
if new_leads > 0:
    print(
        "Operive DFW lead monitor: "
        f"{new_leads} new qualified signal(s), {total} total deduped leads.\n"
        f"Dashboard: {payload.get('dashboard')}\n"
        f"Digest: {payload.get('digest')}\n"
        "Outreach remains not_contacted until CEO approval."
    )
