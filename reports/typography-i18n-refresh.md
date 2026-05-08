# Operive typography + multilingual UI refresh

## 1) Font system

### Recommended production pairing
- **English / French / Spanish / German / Portuguese:** `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`
- **Arabic:** `"IBM Plex Sans Arabic", "Noto Sans Arabic", "Segoe UI", Tahoma, sans-serif`

### Why this pairing
- **Inter** feels modern, neutral, and premium without being flashy.
- It reads cleanly in SaaS-style UI, especially for buttons, nav, forms, and dense body copy.
- **IBM Plex Sans Arabic** is crisp, structured, and professional without feeling overly decorative.
- Both are relatively light, common, and practical for mobile-first loading.

### Language-specific notes
- **EN:** Inter gives sharp hierarchy and clean CTA readability.
- **FR:** Keep line length slightly tighter; French strings expand quickly.
- **ES:** Works well with sentence-case buttons and slightly longer CTA phrasing.
- **AR:** Avoid Latin-style tracking; use more line-height and slightly softer weight balance.

## 2) Typography system

### Desktop
- **H1:** 2.45rem–4.9rem, line-height 1.05, letter-spacing -0.035em
- **H2:** 2rem–3.15rem, line-height 1.14, letter-spacing -0.035em
- **H3:** 1.28rem–1.72rem, line-height 1.14, letter-spacing -0.02em
- **Body large / intro:** 1.06rem–1.18rem, line-height 1.72
- **Body:** 1rem, line-height 1.65
- **Small / labels / nav / buttons:** 0.82rem–0.94rem

### Mobile
- **H1:** 2.15rem–2.9rem
- **H2:** 1.7rem–2.2rem
- **H3:** 1.16rem–1.42rem
- **Body large:** 1.02rem
- **Body:** 1rem
- **Small:** 0.82rem–0.94rem

### Arabic adjustments
- **H1:** 2.35rem–4.15rem, line-height 1.18
- **H2:** 1.8rem–3rem, line-height 1.28
- **H3:** 1.22rem–1.9rem, line-height 1.42
- **Body:** line-height 1.82
- **Letter spacing:** 0 for headings, pills, and labels

## 3) Spacing system

Use a compact 8pt-style rhythm:
- `4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px`

### UI usage
- **Between label and field:** 8px
- **Between stacked form fields:** 16px
- **Button horizontal padding:** 20px
- **Card padding:** 24px–32px
- **Section spacing:** 32px top / 64px bottom
- **Hero spacing:** generous, but keep mobile tighter than desktop

## 4) Button + CTA style

### Style rules
- Use **sentence case**, not title case screaming.
- Keep primary CTA intent consistent across languages.
- Prefer short action phrases.

### Recommended CTA set
- **EN:** Book a workflow review / See examples
- **AR:** احجز مراجعة / شاهد الأمثلة
- **FR:** Réserver un diagnostic / Voir des exemples
- **ES:** Reservar una revisión / Ver ejemplos

## 5) Sample rewritten UI text

### English
- **Hero eyebrow:** Practical AI for service teams
- **Hero title:** AI workflows that save time and capture more leads
- **Hero body:** Operive helps small businesses automate lead response, scheduling, follow-up, and customer communication with systems built for real operations.
- **Trust title:** Guardrails for real business use
- **Closing CTA:** Start with the workflow costing you the most time

### Arabic
- **Hero eyebrow:** حلول ذكاء اصطناعي عملية لفرق الخدمات
- **Hero title:** أنظمة ذكاء اصطناعي توفّر الوقت وتزيد الفرص
- **Hero body:** نساعد الشركات الصغيرة على تحسين سرعة الرد، المتابعة، والحجز عبر أنظمة عملية تُبنى حول طريقة عملك.
- **Trust title:** أتمتة عملية ضمن حدود واضحة
- **Closing CTA:** ابدأ بالعملية التي تستهلك أكبر قدر من وقت فريقك

### French
- **Hero eyebrow:** IA pratique pour équipes de service
- **Hero title:** Des workflows IA qui font gagner du temps et captent plus de prospects
- **Hero body:** Operive aide les petites entreprises à automatiser la réponse aux leads, la prise de rendez-vous, le suivi et la communication client avec des systèmes pensés pour l’exploitation réelle.
- **Primary CTA:** Réserver un diagnostic
- **Secondary CTA:** Voir des exemples

## 6) Implementation notes

### Applied in this repo now
- Swapped Latin UI font direction from **Manrope** to **Inter**.
- Kept a dedicated Arabic UI font stack.
- Introduced a cleaner type scale with mobile-specific clamps.
- Reduced Latin tracking noise in nav/buttons and removed tracking for Arabic UI labels.
- Tightened English homepage copy for a more premium SaaS tone.
- Refined Arabic homepage copy to sound more native and less literal.

### Still needed in the real production project
- Apply the same type tokens in the live Astro codebase.
- Add reviewed FR/ES locale content, not just locale labels.
- Localize meta titles/descriptions and CTA text per page.
- QA real devices for Arabic wrapping, nav density, and third-party widgets.
- Replace English-heavy third-party booking/chat copy where possible.
