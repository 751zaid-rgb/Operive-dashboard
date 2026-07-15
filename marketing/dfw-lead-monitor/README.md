# DFW AI workflow lead monitor

Runs as a Hermes cron job every 6 hours. It searches DFW commercial-intent signals, scores prospects, and appends findings to this folder. No outreach is sent without CEO approval.

Inputs:
- seed_queries.csv

Outputs expected from cron:
- leads.csv
- daily-review.md

Qualification score:
- +3 DFW-local business
- +3 segment fit: restaurant, home services, med spa, dental, local services
- +2 visible phone/form/booking workflow
- +2 signal of missed calls, hiring front desk, slow response, events/catering, emergency service, after-hours
- +1 owner/operator contact path

Next step after review: draft 1:1 outreach, then request CEO approval before any external send.
