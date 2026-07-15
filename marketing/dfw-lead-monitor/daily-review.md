# DFW lead monitor daily review

## 2026-07-15

Searched seed-query themes across DFW restaurants/catering, home services, med spa, dental, and local urgent services. Added 10 prospects to `leads.csv`. URL/page verification was based on search-result snippets because the configured extraction backend is search-only and could not fetch full page bodies; uncertain operational details are marked in `verification_needed`.

### Top 5 scored prospects

| Score | Prospect | Segment | Signal | Recommended angle |
|---:|---|---|---|---|
| 11 | Matco Services | Home services | 24/7 HVAC/plumbing emergency page warns not to wait for form response; real people answer 24/7. | Missed-call text-back + emergency intake triage for after-hours service leads. |
| 11 | The Dallas Roofer | Home services | Storm/hail roofing page emphasizes no waiting on hold and real person from first contact. | Post-storm lead capture, photo/address intake, estimator booking handoff. |
| 11 | Oliver Garage Door | Home services | Dallas 24/7 emergency garage-door service with call-now urgency. | Urgent repair triage + missed-call recovery for same-day bookings. |
| 11 | 360 Catering & Events | Restaurant/catering | Fort Worth quote-request flow for weddings, special occasions, and corporate events. | Event inquiry follow-up assistant: date/headcount/budget capture and quote reminders. |
| 11 | Dallas Dental Care | Dental | Contact page combines message/call scheduling with patient-form attachment. | New-patient intake automation, missing-form reminders, and appointment handoff. |

### Next recommended internal actions

1. Manually verify the top 5 pages in browser before any outreach: active form, phone path, decision-maker/office-manager route, and current service area.
2. Draft two reusable value-prop snippets: one for urgent home services missed-call recovery, one for appointment/event inquiry follow-up.
3. Build a simple tracking view grouped by `segment` and `qualification_score >= 11`; keep all `outreach_status` as `not_contacted` until explicit approval.
4. For the next monitor run, search specifically for hiring signals: `site:indeed.com Dallas HVAC dispatcher`, `Dallas dental front desk hiring`, `Fort Worth catering coordinator hiring`.
