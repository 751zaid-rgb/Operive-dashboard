#!/usr/bin/env python3
import json
import os
import urllib.request
from datetime import datetime, UTC

API_URL = "https://api.buffer.com/graphql"
TOKENS = {
    "yt_tiktok_fb": os.environ["BUFFER_TOKEN_YT_TIKTOK_FB"],
}
CHANNELS = {
    "youtube": {"token": "yt_tiktok_fb", "id": "6a1fac52c687a22dd4552bfc", "name": "Operive"},
    "facebook": {"token": "yt_tiktok_fb", "id": "6a1fad67c687a22dd4552f8c", "name": "Operive"},
}
POSTS = [
    {
        "key": "tue-workflow",
        "title": "How Operive AI Front Desk works",
        "dueAt": "2026-07-14T15:00:00.000Z",
        "media": "https://www.operive.com/assets/media/operive-weekly-speed-2026-06-08.mp4",
        "caption": "Your customer asks. Operive answers. The request is captured, organized, and escalated only when needed.\n\nThat is the point of AI Front Desk: not a flashy chatbot, a practical intake workflow your team can actually use.",
    },
    {
        "key": "sat-founder-pov",
        "title": "Small businesses need handled workflows",
        "dueAt": "2026-07-18T16:00:00.000Z",
        "media": "https://www.operive.com/assets/media/operive-vertical-short-2026-06-05.mp4",
        "caption": "Small businesses do not need more dashboards.\n\nThey need the repetitive work handled: first replies, FAQs, intake, follow-up, and clean handoff.\n\nThat is what Operive builds.",
    },
]
MUTATION = """
mutation CreateScheduledPost($input: CreatePostInput!) {
  createPost(input: $input) {
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
    if service == "facebook":
        return {"facebook": {"type": "reel"}}

results = []
failures = []
for post in POSTS:
    for service, ch in CHANNELS.items():
        input_obj = {
            "text": post["caption"],
            "channelId": ch["id"],
            "schedulingType": "automatic",
            "mode": "customScheduled",
            "dueAt": post["dueAt"],
            "assets": [{"video": {"url": post["media"], "metadata": {"thumbnailOffset": 2000}}}],
            "metadata": metadata_for(service, post),
        }
        try:
            res = gql(TOKENS[ch["token"]], {"input": input_obj})
            payload = res.get("data", {}).get("createPost")
            if res.get("errors") or not payload or payload.get("message"):
                failures.append({"post": post["key"], "service": service, "error": payload.get("message") if payload else res.get("errors")})
            else:
                p = payload["post"]
                results.append({"post": post["key"], "service": service, "channel": ch["name"], "id": p["id"], "dueAt": p.get("dueAt"), "status": p.get("status")})
        except Exception as e:
            failures.append({"post": post["key"], "service": service, "error": str(e)})

out = {"created": results, "failures": failures, "created_count": len(results), "failure_count": len(failures), "ran_at": datetime.now(UTC).isoformat()}
with open("schedule-retry-results-2026-07-13.json", "w") as f:
    json.dump(out, f, indent=2)
print(json.dumps(out, indent=2))
raise SystemExit(1 if failures else 0)
