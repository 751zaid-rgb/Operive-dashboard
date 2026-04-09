const dashboard = {
  updatedAt: '2026-04-09',
  stats: [
    { label: 'Primary market', value: 'Home services', note: 'Built for practical small-business operations' },
    { label: 'Core offer', value: 'Speed-to-lead', note: 'Missed-call recovery, booking, and follow-up' },
    { label: 'Delivery model', value: 'Sprint based', note: 'Audit, implementation, training, optimization' },
    { label: 'Contact', value: 'hello@operive.com', note: 'Direct business contact for new work' },
  ],
  trustSignals: [
    {
      title: 'Implementation-first',
      text: 'Operive focuses on fixing one real workflow at a time instead of selling vague AI strategy decks.',
    },
    {
      title: 'Human-reviewed operations',
      text: 'AI supports routing, drafting, summaries, and follow-up, while humans keep oversight where mistakes matter.',
    },
    {
      title: 'Works with existing tools',
      text: 'The goal is to improve the stack you already use, not force a full rip-and-replace.',
    },
    {
      title: 'Clear business contact',
      text: 'Reach Operive directly at hello@operive.com for audits, implementation sprints, and workflow reviews.',
    },
  ],
  aboutItems: [
    {
      title: 'Built for operators, not AI hobbyists',
      text: 'Operive is for owners and teams who need workflows cleaned up, not a pile of disconnected AI demos.',
    },
    {
      title: 'Best fit: service businesses',
      text: 'Home-service and similar small-business teams are a strong fit because speed-to-lead, intake, and scheduling matter a lot.',
    },
    {
      title: 'Practical rollout',
      text: 'We scope one useful workflow, install it, train the team, and improve it from actual usage.',
    },
  ],
  proofPoints: [
    {
      title: 'Start with one bottleneck',
      text: 'Operive begins with the workflow leaking time or revenue right now, usually lead response, missed calls, intake, or scheduling.',
    },
    {
      title: 'Install with bounded scope',
      text: 'Delivery is structured as a focused sprint with concrete handoffs, clear ownership, and a visible before-and-after result.',
    },
    {
      title: 'Train the team during rollout',
      text: 'The workflow is only useful if the team actually adopts it, so training and review are built into implementation.',
    },
    {
      title: 'Improve what works',
      text: 'After launch, Operive tightens prompts, routing, and operating rules based on real usage instead of hype.',
    },
  ],
  caseStudies: [
    {
      title: 'Speed-to-lead follow-up',
      text: 'New inquiries get captured, routed, and answered faster so prospects do not go cold while the team is busy.',
    },
    {
      title: 'Missed-call recovery',
      text: 'Missed calls become documented follow-up tasks and response drafts instead of lost revenue and guesswork.',
    },
    {
      title: 'Booking handoff cleanup',
      text: 'Qualification and scheduling get cleaner handoffs so fewer leads stall between office staff, field staff, and calendars.',
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

function renderTrustSignals() {
  byId('trust-grid').innerHTML = dashboard.trustSignals
    .map(
      (item) => `
        <article class="trust-card">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `,
    )
    .join('');
}

function renderAbout() {
  byId('about-grid').innerHTML = dashboard.aboutItems
    .map(
      (item) => `
        <article class="trust-card">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `,
    )
    .join('');
}

function renderProofPoints() {
  byId('proof-grid').innerHTML = dashboard.proofPoints
    .map(
      (item, index) => `
        <article class="trust-card proof-card">
          <div class="pill">0${index + 1}</div>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `,
    )
    .join('');
}

function renderCaseStudies() {
  byId('case-grid').innerHTML = dashboard.caseStudies
    .map(
      (item) => `
        <article class="trust-card">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `,
    )
    .join('');
}

function init() {
  byId('last-updated').textContent = dashboard.updatedAt;
  renderStats();
  renderTrustSignals();
  renderAbout();
  renderProofPoints();
  renderCaseStudies();
}

init();
