#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / "src" / "posts" / "week-2026-07-13-leads.json"
OUT = ROOT / "out" / "leads"
PUBLIC = Path("/Users/zaidai/Operive-dashboard/assets/media/social-week-2026-07-13")
OUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

posts = json.loads(POSTS.read_text())
for post in posts:
    props = dict(post)
    props["week"] = "2026-07-13"
    props_path = OUT / f"{post['key']}.json"
    props_path.write_text(json.dumps(props, indent=2))
    mp4 = PUBLIC / f"operive-{post['key']}-vertical.mp4"
    png = OUT / f"{post['key']}.png"
    subprocess.run([
        "npx", "remotion", "still", "src/Root.tsx", "OperiveWeekShort", str(png),
        "--props", str(props_path), "--frame", "90"
    ], cwd=ROOT, check=True)
    subprocess.run([
        "npx", "remotion", "render", "src/Root.tsx", "OperiveWeekShort", str(mp4),
        "--props", str(props_path), "--codec", "h264"
    ], cwd=ROOT, check=True)
    print(mp4)
