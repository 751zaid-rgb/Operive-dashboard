#!/usr/bin/env python3
import json
import os
import sys
import urllib.request
from datetime import datetime, UTC
from pathlib import Path

API_URL = "https://api.buffer.com/graphql"
BASE = "https://www.operive.com/assets/media/social-week-2026-07-13/operive-{}-vertical.mp4"
ROOT = Path(__file__).resolve().parent
TOKENS = {
    "yt_tiktok_fb": os.environ["BUFFER_TOKEN_YT_TIKTOK_FB"],
    "ig_x_linkedin": os.environ["BUFFER_TOKEN_IG_X_LINKEDIN"],
}
CHANNELS = {
    "youtube": {"token": "yt_tiktok_fb", "id": "6a1fac52c687a22dd4552bfc", "name": "Operive"},
    "tiktok": {"token": "yt_tiktok_fb", "id": "6a1fac64c687a22dd4552c31", "name": "operive"},
    "facebook": {"token": "yt_tiktok_fb", "id": "6a1fad67c687a22dd4552f8c", "name": "Operive"},
    "twitter": {"token": "ig_x_linkedin", "id": "6a22e501c687a22dd463d584", "name": "HelloOperive"},
    "instagram": {"token": "ig_x_linkedin", "id": "6a22e533c687a22dd463d7f0", "name": "ope.rive"},
    "linkedin": {"token": "ig_x_linkedin", "id": "6a22ea8bc687a22dd463fb3c", "name": "operive"},
}
POSTS = [
    {"key":"mon-after-hours","title":"Stop losing leads after hours","dueAt":"2026-07-14T01:30:00.000Z","caption":"Most small businesses do not lose leads because the team is bad. They lose them because customers message after hours, ask the same questions, then move on.\n\nOperive AI Front Desk answers, captures the request, and hands off the qualified lead when a human is needed.\n\nBook a walkthrough: https://calendly.com/operive/30min","x":"Most small businesses do not lose leads from lack of effort.\n\nThey lose them because customers message after hours, ask the same questions, then move on.\n\nOperive AI Front Desk captures the request on WhatsApp/Telegram and hands off when needed.\n\nhttps://calendly.com/operive/30min"},
    {"key":"tue-workflow","title":"How Operive AI Front Desk works","dueAt":"2026-07-14T15:00:00.000Z","caption":"Your customer asks. Operive answers. The request is captured, organized, and escalated only when needed.\n\nThat is the point of AI Front Desk: not a flashy chatbot, a practical intake workflow your team can actually use."},
    {"key":"wed-restaurants","title":"AI Front Desk for restaurant messages","dueAt":"2026-07-15T15:00:00.000Z","caption":"Restaurants get the same messages every day: hours, menu, reservations, catering, location, delivery, availability.\n\nOperive AI Front Desk handles the repeat questions and captures high-intent requests so staff can stay focused on service."},
    {"key":"thu-home-services","title":"Turn home service messages into intake","dueAt":"2026-07-16T15:00:00.000Z","caption":"For home services, speed wins.\n\nIf a customer asks for availability, pricing, or a booking window and waits too long, they call the next business.\n\nOperive AI Front Desk keeps the conversation moving and turns the message into a usable intake."},
    {"key":"fri-handoff","title":"Automation should know when to hand off","dueAt":"2026-07-17T15:00:00.000Z","caption":"Good automation should know when to stop.\n\nOperive AI Front Desk answers common questions, collects the details, and hands off to a person when the lead is ready for a real conversation."},
    {"key":"sat-founder-pov","title":"Small businesses need handled workflows","dueAt":"2026-07-18T16:00:00.000Z","caption":"Small businesses do not need more dashboards.\n\nThey need the repetitive work handled: first replies, FAQs, intake, follow-up, and clean handoff.\n\nThat is what Operive builds."},
    {"key":"sun-recap","title":"What AI Front Desk handles in one week","dueAt":"2026-07-19T16:00:00.000Z","caption":"In one week, AI Front Desk can help with:\n\n- After-hours replies\n- FAQ handling\n- Lead capture\n- Booking requests\n- Customer intake\n- Human handoff\n- Follow-up prompts\n\nSimple, practical workflows that save time and protect revenue."},
]

MUTATION = """
mutation EditScheduledPost($input: EditPostInput!) {
  editPost(input: $input) {
    ... on PostActionSuccess { post { id text dueAt channelId status assets { id mimeType source } } }
    ... on MutationError { message }
  }
}
"""

def gql(token, variables):
    data = json.dumps({"query": MUTATION, "variables": variables}).encode()
    req = urllib.request.Request(API_URL, data=data, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())

def metadata_for(service, post):
    if service == "youtube":
        return {"youtube": {"title": post["title"], "privacy": "public", "categoryId": "28", "license": "youtube", "notifySubscribers": True, "embeddable": True, "madeForKids": False, "isAiGenerated": True}}
    if service == "instagram":
        return {"instagram": {"type": "reel", "shouldShareToFeed": True, "isAiGenerated": True}}
    if service == "facebook":
        return {"facebook": {"type": "reel"}}
    if service == "tiktok":
        return {"tiktok": {"isAiGenerated": True}}
    if service == "twitter":
        return {"twitter": {"isAiGenerated": True}}
    return None

def load_ids():
    ids = {}
    for file in ["schedule-results-2026-07-13.json", "schedule-retry-results-2026-07-13.json"]:
        data = json.loads((ROOT / file).read_text())
        for item in data["created"]:
            ids[(item["post"], item["service"])] = item["id"]
    return ids

ids = load_ids()
results, failures = [], []
for post in POSTS:
    for service, ch in CHANNELS.items():
        pid = ids.get((post["key"], service))
        if not pid:
            failures.append({"post": post["key"], "service": service, "error": "missing existing scheduled post id"})
            continue
        text = post.get("x") if service == "twitter" and post.get("x") else post["caption"]
        input_obj = {
            "id": pid,
            "text": text,
            "schedulingType": "automatic",
            "mode": "customScheduled",
            "dueAt": post["dueAt"],
            "assets": [{"video": {"url": BASE.format(post["key"]), "metadata": {"thumbnailOffset": 2000}}}],
        }
        md = metadata_for(service, post)
        if md: input_obj["metadata"] = md
        try:
            res = gql(TOKENS[ch["token"]], {"input": input_obj})
            payload = res.get("data", {}).get("editPost")
            if res.get("errors") or not payload or payload.get("message"):
                failures.append({"post": post["key"], "service": service, "id": pid, "error": payload.get("message") if payload else res.get("errors")})
            else:
                p = payload["post"]
                results.append({"post": post["key"], "service": service, "id": p["id"], "dueAt": p.get("dueAt"), "status": p.get("status"), "asset": BASE.format(post["key"])})
        except Exception as e:
            failures.append({"post": post["key"], "service": service, "id": pid, "error": str(e)})

out = {"updated": results, "failures": failures, "updated_count": len(results), "failure_count": len(failures), "ran_at": datetime.now(UTC).isoformat()}
(ROOT / "edit-results-2026-07-13.json").write_text(json.dumps(out, indent=2))
print(json.dumps({"updated_count": len(results), "failure_count": len(failures), "failures": failures}, indent=2))
sys.exit(1 if failures else 0)
