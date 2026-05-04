# Operive EN/AR review

## English version — what still needs improvement

- **Hero copy is decent but still a little long.** It communicates clearly, but it could be tighter and more forceful above the fold.
- **CTA stack is busy.** Multiple CTA buttons in the hero compete with each other. One primary CTA plus one secondary is stronger.
- **Some phrasing is slightly consultant-ish.** Phrases like "implementation-first" and "operational friction" are fine, but too much of it can sound abstract if not balanced with concrete outcomes.
- **Trust is pretty good, but proof is still thin.** There are no testimonials, no concrete case examples with outcomes, and no visible trust signals beyond copy.
- **Calendly embed is useful but heavy.** A large inline embed can feel like a commitment too early; sometimes a cleaner booking CTA performs better.
- **Top nav density is a bit high.** The number of links is acceptable, but the header starts to feel crowded once the language control and CTA are added.

## Arabic version — what still needs improvement

- **Arabic support is real, but not fully polished.** It is much better than a fake RTL flip, but some phrasing still feels translated rather than natively written for persuasion.
- **A few Arabic strings feel too literal or operationally awkward.** For example, some workflow/process language sounds more internal than sales-oriented.
- **English product terms still leak through.** Words like "sprint" should ideally be localized more gracefully or intentionally presented as product terms.
- **RTL layout needs QA page-by-page.** The homepage looks structurally prepared, but nav density, pills, badges, compare blocks, and embedded widgets still need real device review.
- **Calendly and third-party UI remain mostly English-first.** That weakens the Arabic experience even if the page copy is translated.
- **There is at least one encoding/text corruption issue in the live Arabic payload** (a malformed character appeared in one Arabic trust principle string), which needs fixing in the real production source.

## Blunt take

- The live `operive.com` site is materially ahead of this repo for multilingual support.
- The current workspace repo is **not** the production source for the customer-facing site.
- So the right operational move is to identify the real production repo/project, then apply copy/UX polish there instead of pretending this workspace controls the live site.
