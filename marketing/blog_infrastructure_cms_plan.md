# Operive blog infrastructure

Status: static CMS layer live on operive.com/blog using the existing GitHub Pages/static deployment. Ghost/Webflow/WordPress was not provisioned because no CMS/admin credentials or domain registrar access are present in this runtime. The current deployed path is fast, CDN-backed by the existing host, SSL-enabled at https://www.operive.com/blog/, and version-controlled.

## Live infrastructure

- Public blog index: https://www.operive.com/blog/
- Static article pages: https://www.operive.com/blog/<slug>/
- Spanish mirrors: https://www.operive.com/es/blog/<slug>/
- Arabic mirrors: https://www.operive.com/ar/blog/<slug>/
- Stylesheet: https://www.operive.com/blog/seo-blog.css
- Sitemap: https://www.operive.com/sitemap-0.xml
- Generator: marketing/generate_seo_blog_and_leads.py

## Content operations

1. Select a row from `marketing/editorial_calendar_operive_blog.csv`.
2. Write the draft using one of the deployed templates under `/blog/templates/`.
3. Mirror content in `/es/blog/` and `/ar/blog/` before marking complete.
4. Re-run the generator or add the static page manually.
5. Verify local routes, then deploy.

## External dependencies still needed for full acceptance

- Ahrefs or Semrush export/API credentials to verify volume >=50 and KD <=30 for the 100+ keyword candidates.
- Google Search Console property/API access for indexing submission/status.
- CMS choice and credentials if Dr. Z wants a non-static editorial UI instead of Git-backed publishing.
