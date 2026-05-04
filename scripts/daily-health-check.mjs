#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const lighthouseDir = path.join(root, '.openclaw', 'lighthouse-fresh');
const reportPath = path.join(root, 'reports', 'daily-health-check.md');
const pages = ['index', 'contact', 'services', 'how-it-works', 'use-cases'];

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const score = (value) => (typeof value === 'number' ? Math.round(value * 100) : 'n/a');

const summary = [];
const missing = [];

for (const page of pages) {
  const file = path.join(lighthouseDir, `${page}.json`);
  if (!fs.existsSync(file)) {
    missing.push(page);
    continue;
  }

  const data = readJson(file);
  const categories = data.categories || {};
  const audits = data.audits || {};

  summary.push({
    page,
    performance: score(categories.performance?.score),
    accessibility: score(categories.accessibility?.score),
    bestPractices: score(categories['best-practices']?.score),
    seo: score(categories.seo?.score),
    fcp: audits['first-contentful-paint']?.displayValue || 'n/a',
    lcp: audits['largest-contentful-paint']?.displayValue || 'n/a',
    speedIndex: audits['speed-index']?.displayValue || 'n/a',
    fetchTime: data.fetchTime || 'n/a'
  });
}

const lines = [
  '# Operive Daily Health Check',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Summary',
  ''
];

for (const row of summary) {
  lines.push(`- **${row.page}** — perf ${row.performance}, access ${row.accessibility}, best-practices ${row.bestPractices}, seo ${row.seo}, FCP ${row.fcp}, LCP ${row.lcp}, Speed Index ${row.speedIndex}`);
}

if (missing.length) {
  lines.push('', '## Missing Lighthouse inputs', '');
  for (const page of missing) {
    lines.push(`- ${page}.json missing from .openclaw/lighthouse-fresh`);
  }
}

lines.push('', '## Practical daily check recommendation', '', '- Re-run Lighthouse for homepage, contact, services, how-it-works, and use-cases daily.', '- Alert if any SEO/accessibility score drops below 95 or performance drops below 85.', '- Manually verify the contact form submission path and thanks page once per day after any funnel edit.', '- Review Cloudflare Pages deploy status and any 404/redirect regressions.');

fs.writeFileSync(reportPath, `${lines.join('\n')}\n`);
console.log(`Wrote ${path.relative(root, reportPath)}`);
