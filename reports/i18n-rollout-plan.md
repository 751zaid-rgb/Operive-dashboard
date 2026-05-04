# Operive multilingual rollout plan

## Safe first-pass recommendation

Because this site is a static Cloudflare Pages site, the safest rollout is:

1. Keep English as the canonical default.
2. Add explicit locale versions as separate pages or locale folders.
3. Use client-side detection only for suggested/default switching, not as the sole way search engines discover content.
4. Let manual language choice override auto-detection and persist in localStorage.
5. Support Arabic with `dir="rtl"` and RTL-specific layout overrides.

## Detection priority

Recommended order:

1. Manual user selection (stored preference)
2. URL locale hint / query override if later added
3. Browser language (`navigator.languages` / `Accept-Language` equivalent client hint)
4. Country/IP hint as a tie-breaker, not the primary signal
5. Fallback to English

Why: country is noisy, multilingual countries are common, and IP-based redirects can hurt SEO/caching if overused.

## Cloudflare Pages / CDN note

Avoid unconditional edge redirects by country for all users. That can create cache fragmentation and crawler ambiguity. Prefer serving the default English page, then suggesting or switching client-side only when a non-English locale is strongly indicated and the user has no saved preference.

## SEO requirements before full rollout

- translated page files for each supported locale
- self-referencing canonical per locale
- `hreflang` tags across locale variants
- `x-default` mapping to English default
- translated meta title/description and structured data where relevant
- locale-aware sitemap entries

## Languages to support first

- English
- Spanish
- French
- German
- Portuguese (Brazil)
- Arabic

## Arabic-specific requirements

- set `dir="rtl"`
- flip nav/button/form alignment where needed
- test mixed LTR/RTL content carefully
- use locale label `العربية`

## Current blocker

The repo does not yet contain translated page variants/content. Safe infrastructure can be added now, but full multilingual SEO rollout requires actual reviewed translations for each page.
