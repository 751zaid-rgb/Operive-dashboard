const dashboard = {
  updatedAt: '2026-04-08',
  executives: {
    ceo: 'You',
    executive: 'Noah',
  },
  stats: [
    { label: 'Active Missions', value: 2, note: 'Mission review plus active operating pipeline' },
    { label: 'Agents in System', value: 7, note: 'Operating under Master-Orchestrator' },
    { label: 'Blocked Items', value: 0, note: 'Core integrations are connected' },
    { label: 'Leads Ready', value: 5, note: 'Prepared for review and outbound decisions' },
  ],
  hierarchy: {
    name: 'CEO',
    role: 'Final owner of business direction',
    children: [
      {
        name: 'Noah',
        role: 'Executive',
        children: [
          {
            name: 'Master-Orchestrator',
            role: 'Business Operations Orchestrator',
            children: [
              { name: 'LeadGen', role: 'Campaign targeting and ICP strategy' },
              { name: 'LeadDiscovery', role: 'Lead discovery and sourcing' },
              { name: 'PromptEngineer', role: 'Prompt hardening and messaging optimization' },
              { name: 'VoiceHandler', role: 'Outbound call operations and qualification' },
              { name: 'Scheduler', role: 'Sales booking and reschedule management' },
              { name: 'marketing-pro', role: 'Marketing execution' },
              { name: 'support-pro', role: 'Customer support operations' },
            ],
          },
        ],
      },
    ],
  },
  agents: [
    {
      name: 'Master-Orchestrator',
      role: 'Business Operations Orchestrator',
      status: 'active',
      reportsTo: 'Noah',
      responsibility: 'Break down goals, route work, verify outputs, and maintain mission state.',
      heartbeat: 'Daily executive sync at 9:00 AM, daily operations sync at 5:00 PM',
      actions: [
        'Accepted the lead generation mission',
        'Delegated sourcing to LeadDiscovery',
        'Delegated intro drafting to PromptEngineer',
        'Requested review slot preparation from Scheduler',
      ],
    },
    {
      name: 'LeadGen',
      role: 'Campaign and ICP strategy',
      status: 'active',
      reportsTo: 'Master-Orchestrator',
      responsibility: 'Define targeting angles, ideal customer profiles, and funnel ideas.',
      heartbeat: 'On demand or when campaign planning starts',
      actions: [
        'Defining the best-fit home-services ICP for Operive',
        'Shaping outbound angles around speed-to-lead and missed-call recovery',
        'Preparing campaign targeting guidance for marketing-pro',
      ],
    },
    {
      name: 'LeadDiscovery',
      role: 'Lead Discovery Agent',
      status: 'complete',
      reportsTo: 'Master-Orchestrator',
      responsibility: 'Find qualified leads and save them into leads.csv with useful context.',
      heartbeat: 'Weekdays at 8:00 AM America/Chicago',
      actions: [
        'Collected 5 home-service company leads',
        'Captured public contact emails and phone numbers',
        'Mapped pain points for each lead',
      ],
    },
    {
      name: 'PromptEngineer',
      role: 'Prompt Engineering Agent',
      status: 'complete',
      reportsTo: 'Master-Orchestrator',
      responsibility: 'Harden prompts and write optimized intros and messaging.',
      heartbeat: 'Weekdays at 8:30 AM America/Chicago',
      actions: [
        'Drafted 5 tailored intro messages',
        'Aligned copy to Operive positioning',
        'Prepared outreach-ready intros inside leads.csv',
      ],
    },
    {
      name: 'VoiceHandler',
      role: 'Voice Operations Agent',
      status: 'active',
      reportsTo: 'Master-Orchestrator',
      responsibility: 'Qualify leads by call, log transcripts, and escalate hot leads.',
      heartbeat: 'Weekdays at 1:00 PM America/Chicago',
      actions: [
        'Preparing a discovery call flow for the current Operive lead list',
        'Defining a qualification rubric for hot leads',
        'Getting ready to hand qualified prospects to Scheduler',
      ],
    },
    {
      name: 'Scheduler',
      role: 'Executive Scheduling Agent',
      status: 'active',
      reportsTo: 'Master-Orchestrator',
      responsibility: 'Book hot leads and executive review sessions in approved time windows.',
      heartbeat: 'Weekdays at 4:00 PM America/Chicago',
      actions: [
        'Maintaining live booking readiness for hot leads',
        'Holding a recommended 10:00 AM to 10:30 AM review option',
        'Google Calendar and Gmail are connected, live booking is available',
      ],
    },
    {
      name: 'marketing-pro',
      role: 'Marketing Execution Agent',
      status: 'active',
      reportsTo: 'Master-Orchestrator',
      responsibility: 'Execute campaigns, content, and funnel messaging.',
      heartbeat: 'As assigned by Master-Orchestrator',
      actions: [
        'Building a first outbound email sequence for Operive',
        'Turning lead insights into campaign messaging assets',
        'Preparing support copy for fast follow-up',
      ],
    },
    {
      name: 'support-pro',
      role: 'Customer Support Agent',
      status: 'active',
      reportsTo: 'Master-Orchestrator',
      responsibility: 'Triage issues, support customers, and maintain service continuity.',
      heartbeat: 'Daily at 9:00 AM America/Chicago',
      actions: [
        'Drafting a missed-inquiry recovery workflow',
        'Preparing follow-up logic for unresponsive leads',
        'Building a simple support triage path for Operive inquiries',
      ],
    },
  ],
  missions: [
    {
      id: 'Mission 001',
      status: 'review',
      priority: 'high',
      owner: 'Master-Orchestrator',
      goal: 'Find 5 leads for the AI consulting business, draft custom intros for each, and prepare a review slot for tomorrow morning.',
      supportingAgents: ['LeadDiscovery', 'PromptEngineer', 'Scheduler'],
      deliverables: ['leads.csv', 'review_schedule.md'],
      nextAction: 'Confirm or manually place the 10:00 AM to 10:30 AM review slot for 2026-04-09.',
      notes: [
        '5 company-level leads collected with public contact emails.',
        '5 tailored intros drafted and saved in leads.csv.',
        'Scheduler prepared tomorrow morning options.',
        'Google Calendar and Gmail are now connected, so live booking is available.',
      ],
    },
    {
      id: 'Mission 002',
      status: 'active',
      priority: 'high',
      owner: 'Master-Orchestrator',
      goal: 'Activate the currently idle Operive agents with concrete starter work.',
      supportingAgents: ['LeadGen', 'VoiceHandler', 'Scheduler', 'marketing-pro', 'support-pro'],
      deliverables: ['Updated dashboard activity', 'Starter missions', 'Campaign and support workflow assets'],
      nextAction: 'Choose which active workstream to execute first, campaign, calls, scheduling, or support.',
      notes: [
        'LeadGen is working on ICP and outbound angles.',
        'VoiceHandler is preparing a discovery call flow and qualification rubric.',
        'Scheduler is maintaining live booking readiness.',
        'marketing-pro is drafting a first outbound sequence.',
        'support-pro is building a missed-inquiry recovery workflow.',
      ],
    },
  ],
  reportingLines: [
    'CEO owns strategic direction, approvals, and final priorities.',
    'Noah oversees Master-Orchestrator and executive execution quality.',
    'Master-Orchestrator coordinates all specialist agents and verifies outputs.',
    'LeadDiscovery, PromptEngineer, VoiceHandler, Scheduler, marketing-pro, and support-pro all report upstream through Master-Orchestrator.',
  ],
  feed: [
    {
      time: 'Most recent',
      agent: 'marketing-pro',
      status: 'active',
      text: 'Started building the first Operive outbound email sequence from the approved lead package.',
    },
    {
      time: 'Most recent',
      agent: 'support-pro',
      status: 'active',
      text: 'Started drafting a missed-inquiry recovery workflow and follow-up path for inbound prospects.',
    },
    {
      time: 'Most recent',
      agent: 'VoiceHandler',
      status: 'active',
      text: 'Started preparing the discovery call flow and lead qualification rubric.',
    },
    {
      time: 'Most recent',
      agent: 'LeadGen',
      status: 'active',
      text: 'Started defining the best-fit home-services ICP and outbound targeting angles.',
    },
    {
      time: 'Most recent',
      agent: 'Scheduler',
      status: 'active',
      text: 'Google Calendar and Gmail are connected, and live booking is available for review slots and hot leads.',
    },
    {
      time: 'Most recent',
      agent: 'PromptEngineer',
      status: 'complete',
      text: 'Finished 5 custom intro messages tailored to each sourced lead.',
    },
    {
      time: 'Most recent',
      agent: 'LeadDiscovery',
      status: 'complete',
      text: 'Delivered 5 public leads relevant to the AI consulting offer.',
    },
    {
      time: 'Mission kickoff',
      agent: 'Master-Orchestrator',
      status: 'active',
      text: 'Accepted the mission and split it across sourcing, intro drafting, and scheduling workstreams.',
    },
  ],
};

const byId = (id) => document.getElementById(id);

function renderStats() {
  byId('stats-grid').innerHTML = dashboard.stats
    .map(
      (item) => `
        <article class="stat-card">
          <div class="pill">${item.label}</div>
          <div class="stat-value">${item.value}</div>
          <div class="agent-meta">${item.note}</div>
        </article>
      `,
    )
    .join('');
}

function renderNode(node) {
  return `
    <div class="tree-node">
      <strong>${node.name}</strong>
      <div class="agent-meta">${node.role}</div>
      ${node.children?.length ? `<div class="tree-children">${node.children.map(renderNode).join('')}</div>` : ''}
    </div>
  `;
}

function renderHierarchy() {
  byId('hierarchy-tree').innerHTML = renderNode(dashboard.hierarchy);
}

function badge(status) {
  return `<span class="badge ${status}">${status}</span>`;
}

function renderAgents() {
  const query = byId('agent-search').value.trim().toLowerCase();
  const status = byId('status-filter').value;
  const filtered = dashboard.agents.filter((agent) => {
    const matchesQuery = [agent.name, agent.role, agent.responsibility].join(' ').toLowerCase().includes(query);
    const matchesStatus = status === 'all' || agent.status === status;
    return matchesQuery && matchesStatus;
  });

  byId('agent-grid').innerHTML = filtered
    .map(
      (agent) => `
        <article class="agent-card">
          <div class="agent-header">
            <div>
              <h3>${agent.name}</h3>
              <div class="agent-meta">${agent.role}</div>
            </div>
            ${badge(agent.status)}
          </div>
          <div class="agent-meta">
            <span class="pill">Reports to ${agent.reportsTo}</span>
            <span class="pill">${agent.heartbeat}</span>
          </div>
          <div>${agent.responsibility}</div>
          <div class="agent-list">
            <strong>Current known actions</strong>
            <ul>
              ${agent.actions.map((action) => `<li>${action}</li>`).join('')}
            </ul>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderMissions() {
  byId('mission-list').innerHTML = dashboard.missions
    .map(
      (mission) => `
        <article class="mission-card">
          <div class="agent-header">
            <div>
              <h3>${mission.id}</h3>
              <p>${mission.goal}</p>
            </div>
            ${badge(mission.status)}
          </div>
          <div class="mission-meta">
            <span class="pill">Priority: ${mission.priority}</span>
            <span class="pill">Owner: ${mission.owner}</span>
            <span class="pill">Agents: ${mission.supportingAgents.join(', ')}</span>
          </div>
          <div>
            <strong>Deliverables</strong>
            <ul>${mission.deliverables.map((item) => `<li>${item}</li>`).join('')}</ul>
          </div>
          <div>
            <strong>Current notes</strong>
            <ul>${mission.notes.map((item) => `<li>${item}</li>`).join('')}</ul>
          </div>
          <div><strong>Next action:</strong> ${mission.nextAction}</div>
        </article>
      `,
    )
    .join('');
}

function renderFeed() {
  byId('activity-feed').innerHTML = dashboard.feed
    .map(
      (item) => `
        <article class="feed-item">
          <div class="feed-top">
            <strong>${item.agent}</strong>
            <div>
              ${badge(item.status)}
            </div>
          </div>
          <div>${item.text}</div>
          <div class="timeline-time">${item.time}</div>
        </article>
      `,
    )
    .join('');
}

function renderReportingLines() {
  byId('reporting-lines').innerHTML = dashboard.reportingLines
    .map((line) => `<li class="report-line">${line}</li>`)
    .join('');
}

function init() {
  byId('last-updated').textContent = dashboard.updatedAt;
  renderStats();
  renderHierarchy();
  renderAgents();
  renderMissions();
  renderFeed();
  renderReportingLines();

  byId('agent-search').addEventListener('input', renderAgents);
  byId('status-filter').addEventListener('change', renderAgents);
}

init();
