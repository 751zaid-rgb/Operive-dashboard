# COMPANY_DASHBOARD.md

Last updated: 2026-04-08

## Executive Hierarchy

```text
CEO
└── Noah (Executive)
    └── Master-Orchestrator
        ├── LeadGen
        ├── LeadDiscovery
        ├── PromptEngineer
        ├── VoiceHandler
        ├── Scheduler
        ├── marketing-pro
        └── support-pro
```

## Reporting Lines

- CEO: final owner of business direction, priorities, and approvals
- Noah: executive lead, oversees Master-Orchestrator and reviews cross-agent execution
- Master-Orchestrator: central operator for delegation, quality control, and mission tracking
- LeadGen: reports to Master-Orchestrator
- LeadDiscovery: reports to Master-Orchestrator
- PromptEngineer: reports to Master-Orchestrator
- VoiceHandler: reports to Master-Orchestrator
- Scheduler: reports to Master-Orchestrator
- marketing-pro: reports to Master-Orchestrator
- support-pro: reports to Master-Orchestrator

## Agent Responsibilities

### Master-Orchestrator
- Intake high-level goals
- Break goals into concrete tasks
- Delegate work to specialist agents
- Verify outputs before presenting results
- Maintain `MISSION_CONTROL.md`

### LeadGen
- Define ICPs and targeting angles
- Shape campaign inputs and funnel ideas
- Support outbound strategy

### LeadDiscovery
- Find qualified leads from approved public sources
- Capture company, pain point, and contact details
- Prepare outreach-ready batches in `leads.csv`

### PromptEngineer
- Harden prompts and draft messaging
- Optimize brand voice and conversion triggers
- Maintain reusable prompt assets in `prompt_library.json`

### VoiceHandler
- Run outbound calling workflows
- Use discovery scripts and qualify leads
- Hand off qualified leads to Scheduler
- Log transcripts to `/logs/calls/`

### Scheduler
- Book hot leads into approved sales windows
- Handle reschedules and invite flow
- Track confirmed meeting links and review slots

### marketing-pro
- Execute marketing tasks, campaigns, and outbound content
- Support funnel messaging and growth experiments

### support-pro
- Handle customer support workflows
- Triage issues, follow up, and maintain service continuity

## Heartbeat Schedule

### Recommended recurring agent heartbeat plan
- LeadDiscovery: weekdays at 8:00 AM America/Chicago
  - Goal: find 10 new qualified leads and report to Master-Orchestrator
- PromptEngineer: weekdays at 8:30 AM America/Chicago
  - Goal: review prompt assets and optimize active messaging
- Executive Sync: daily at 9:00 AM America/Chicago
  - Participants: CEO, Noah, Master-Orchestrator
- VoiceHandler: weekdays at 1:00 PM America/Chicago
  - Goal: process qualified leads for outbound calling
- Scheduler: weekdays at 4:00 PM America/Chicago
  - Goal: review hot leads, calendar windows, and pending reschedules
- Operations Sync: daily at 5:00 PM America/Chicago
  - Participants: Noah, Master-Orchestrator, LeadDiscovery, PromptEngineer, VoiceHandler, Scheduler
- support-pro: daily at 9:00 AM America/Chicago
  - Goal: review open support needs and unresolved follow-ups

## Operating Rules

- All major missions flow through Master-Orchestrator
- Specialist agents report completion, blockers, or review status back upstream
- Noah receives executive-level summaries, escalations, and daily sync outputs
- CEO approves high-impact strategic decisions and final priorities

## Active Mission Panel

### Mission 001
- Goal: Find 5 leads for the AI consulting business, draft custom intros for each, and prepare a review slot for tomorrow morning
- Owner: Master-Orchestrator
- Supporting agents: LeadDiscovery, PromptEngineer, Scheduler
- Status: review
- Priority: high
- Deliverables:
  - `leads.csv`
  - `review_schedule.md`
- Current notes:
  - 5 company-level leads collected with public contact emails
  - 5 tailored intros drafted and saved in `leads.csv`
  - Scheduler prepared tomorrow morning options
  - Live Google Calendar booking is still blocked in this session
- Recommended next action:
  - Confirm or manually place the 10:00 AM to 10:30 AM review slot for 2026-04-09

## Dashboard Snapshot

- Active missions: 1
- In review: 1
- Blocked items: 1, live calendar booking access
- Lead inventory prepared: 5 leads ready for review
- Next executive action: approve review slot and outbound direction
