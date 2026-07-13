#!/usr/bin/env python3
import json
import os
import urllib.request
from collections import Counter

API_URL = "https://api.buffer.com/graphql"
TOKENS = {
    "yt_tiktok_fb": os.environ["BUFFER_TOKEN_YT_TIKTOK_FB"],
    "ig_x_linkedin": os.environ["BUFFER_TOKEN_IG_X_LINKEDIN"],
}
ORGS = {
    "yt_tiktok_fb": "6a1fa7a06a70a96e13765a99",
    "ig_x_linkedin": "6a22e2c167c8277e8dc5f98e",
}
Q = """
query($org: OrganizationId!) {
  posts(first: 100, input: { organizationId: $org, filter: { status: [scheduled] } }) {
    edges { node { id dueAt channelId status text } }
  }
}
"""

def gql(token, org):
    data = json.dumps({"query": Q, "variables": {"org": org}}).encode()
    req = urllib.request.Request(API_URL, data=data, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())

all_posts = []
errors = []
for label, tok in TOKENS.items():
    data = gql(tok, ORGS[label])
    if data.get("errors"):
        errors.append({"token": label, "errors": data["errors"]})
        continue
    for edge in data["data"]["posts"]["edges"]:
        n = edge["node"]
        if n.get("dueAt") and "2026-07-14" <= n["dueAt"][:10] <= "2026-07-19":
            all_posts.append(n)

out = {
    "scheduled_this_week_count": len(all_posts),
    "by_date": dict(sorted(Counter(n["dueAt"][:10] for n in all_posts).items())),
    "by_channel_counts": dict(Counter(n["channelId"] for n in all_posts)),
    "errors": errors,
    "sample_ids": [n["id"] for n in all_posts[:10]],
}
print(json.dumps(out, indent=2))
