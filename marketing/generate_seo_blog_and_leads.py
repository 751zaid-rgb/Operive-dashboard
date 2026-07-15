from __future__ import annotations

import csv
import html
import json
import re
from datetime import date, timedelta
from pathlib import Path
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

ROOT = Path('/Users/zaidai/Operive-dashboard')
BASE = 'https://www.operive.com'
AUTHOR = 'Noah Adam'
START = date(2026, 7, 15)

ARTICLES = [
    ('missed-call-text-back-dallas-restaurants', 'Missed Call Text Back for Dallas Restaurants', 'missed call text back Dallas restaurants', 'restaurants'),
    ('ai-front-desk-fort-worth-restaurants', 'AI Front Desk for Fort Worth Restaurants', 'AI front desk Fort Worth restaurants', 'restaurants'),
    ('restaurant-reservation-ai-dfw', 'Restaurant Reservation AI in DFW', 'restaurant reservation AI DFW', 'restaurants'),
    ('after-hours-restaurant-phone-answering-dallas', 'After-Hours Restaurant Phone Answering in Dallas', 'after hours restaurant phone answering Dallas', 'restaurants'),
    ('private-event-inquiry-automation-dfw', 'Private Event Inquiry Automation for DFW Restaurants', 'private event inquiry automation DFW restaurants', 'restaurants'),
    ('catering-lead-follow-up-dallas-restaurants', 'Catering Lead Follow-Up for Dallas Restaurants', 'catering lead follow up Dallas restaurants', 'restaurants'),
    ('hvac-missed-call-text-back-dallas', 'HVAC Missed Call Text Back in Dallas', 'HVAC missed call text back Dallas', 'home services'),
    ('plumbing-lead-response-automation-fort-worth', 'Plumbing Lead Response Automation in Fort Worth', 'plumbing lead response automation Fort Worth', 'home services'),
    ('roofing-lead-intake-ai-dfw', 'Roofing Lead Intake AI in DFW', 'roofing lead intake AI DFW', 'home services'),
    ('garage-door-lead-follow-up-dallas', 'Garage Door Lead Follow-Up Automation in Dallas', 'garage door lead follow up Dallas', 'home services'),
    ('med-spa-lead-response-automation-dallas', 'Med Spa Lead Response Automation in Dallas', 'med spa lead response automation Dallas', 'med spas'),
    ('dental-office-missed-call-automation-dfw', 'Dental Office Missed Call Automation in DFW', 'dental office missed call automation DFW', 'healthcare'),
    ('whatsapp-business-automation-dallas', 'WhatsApp Business Automation in Dallas', 'WhatsApp business automation Dallas', 'local services'),
    ('telegram-intake-automation-dfw', 'Telegram Intake Automation for DFW Businesses', 'Telegram intake automation DFW', 'local services'),
    ('ai-customer-intake-small-business-dallas', 'AI Customer Intake for Dallas Small Businesses', 'AI customer intake small business Dallas', 'local services'),
    ('lead-capture-automation-fort-worth', 'Lead Capture Automation in Fort Worth', 'lead capture automation Fort Worth', 'local services'),
    ('booking-handoff-automation-dfw', 'Booking Handoff Automation for DFW Teams', 'booking handoff automation DFW', 'local services'),
    ('customer-follow-up-automation-dallas', 'Customer Follow-Up Automation in Dallas', 'customer follow up automation Dallas', 'local services'),
    ('ai-receptionist-dallas-small-business', 'AI Receptionist for Dallas Small Business', 'AI receptionist Dallas small business', 'local services'),
    ('ai-receptionist-fort-worth-small-business', 'AI Receptionist for Fort Worth Small Business', 'AI receptionist Fort Worth small business', 'local services'),
    ('missed-lead-recovery-dfw', 'Missed Lead Recovery for DFW Businesses', 'missed lead recovery DFW', 'local services'),
    ('speed-to-lead-automation-dallas', 'Speed-to-Lead Automation in Dallas', 'speed to lead automation Dallas', 'local services'),
    ('service-business-ai-workflows-dfw', 'Service Business AI Workflows in DFW', 'service business AI workflows DFW', 'home services'),
    ('local-business-workflow-automation-dallas', 'Local Business Workflow Automation in Dallas', 'local business workflow automation Dallas', 'local services'),
    ('spanish-english-ai-front-desk-dallas', 'Bilingual AI Front Desk for Dallas Businesses', 'bilingual AI front desk Dallas', 'local services'),
    ('restaurant-phone-ai-plano', 'Restaurant Phone AI in Plano', 'restaurant phone AI Plano', 'restaurants'),
    ('home-services-ai-intake-frisco', 'Home Services AI Intake in Frisco', 'home services AI intake Frisco', 'home services'),
    ('ai-booking-assistant-arlington-tx', 'AI Booking Assistant in Arlington, TX', 'AI booking assistant Arlington TX', 'local services'),
    ('small-business-crm-follow-up-dfw', 'Small Business CRM Follow-Up Automation in DFW', 'small business CRM follow up automation DFW', 'local services'),
    ('ai-front-desk-roi-dfw', 'AI Front Desk ROI for DFW Businesses', 'AI front desk ROI DFW', 'local services'),
]

TRANSLATIONS = {
    'es': {
        'blog_title': 'Blog de automatizacion de Operive',
        'blog_desc': 'Guias comerciales para negocios de Dallas-Fort Worth que quieren captar mas clientes con recepcion, seguimiento e intake con IA.',
        'read': 'Leer guia', 'published': 'Publicado', 'category': 'Categoria', 'cta': 'Solicita una auditoria de intake de 30 minutos',
        'cta_body': 'Operive revisa llamadas perdidas, formularios, WhatsApp, Telegram y seguimiento para encontrar una automatizacion que produzca ingresos medibles.',
        'book': 'Reservar llamada', 'back': 'Volver al blog', 'author': 'Noah Adam',
    },
    'ar': {
        'blog_title': 'مدونة أوبرايف للأتمتة',
        'blog_desc': 'أدلة تجارية لشركات دالاس وفورت وورث التي تريد التقاط المزيد من العملاء عبر الاستقبال والمتابعة وإدخال البيانات بالذكاء الاصطناعي.',
        'read': 'اقرأ الدليل', 'published': 'تاريخ النشر', 'category': 'الفئة', 'cta': 'اطلب تدقيق استقبال العملاء لمدة 30 دقيقة',
        'cta_body': 'تراجع أوبرايف المكالمات الفائتة والنماذج وواتساب وتليجرام والمتابعة لاختيار أتمتة تقود إلى إيرادات قابلة للقياس.',
        'book': 'احجز مكالمة', 'back': 'العودة إلى المدونة', 'author': 'نوح آدم',
    }
}

SPANISH_TITLES = {
    'Missed Call Text Back for Dallas Restaurants': 'Texto automatico para llamadas perdidas en restaurantes de Dallas',
    'AI Front Desk for Fort Worth Restaurants': 'Recepcion con IA para restaurantes de Fort Worth',
}
ARABIC_TITLES = {
    'Missed Call Text Back for Dallas Restaurants': 'رسائل تلقائية للمكالمات الفائتة في مطاعم دالاس',
    'AI Front Desk for Fort Worth Restaurants': 'استقبال بالذكاء الاصطناعي لمطاعم فورت وورث',
}

def slug_title(title, locale):
    if locale == 'es':
        return SPANISH_TITLES.get(title, title.replace('AI', 'IA').replace('Dallas', 'Dallas').replace('DFW', 'DFW'))
    if locale == 'ar':
        return ARABIC_TITLES.get(title, title.replace('AI', 'الذكاء الاصطناعي').replace('Dallas', 'دالاس').replace('Fort Worth', 'فورت وورث').replace('DFW', 'دالاس وفورت وورث'))
    return title

def meta_desc(title, keyword, category, locale):
    if locale == 'es':
        return f'Guia practica sobre {keyword} para equipos de {category} en Dallas-Fort Worth que necesitan responder mas rapido y recuperar clientes potenciales.'
    if locale == 'ar':
        return f'دليل عملي حول {keyword} لفرق {category} في دالاس وفورت وورث للرد بسرعة أكبر واستعادة العملاء المحتملين.'
    return f'Practical guide to {keyword} for {category} teams in Dallas-Fort Worth that need faster response, cleaner intake, and measurable lead recovery.'

def article_body(title, keyword, category, locale):
    if locale == 'es':
        return [
            f'Los negocios de {category} en Dallas-Fort Worth pierden oportunidades cuando una llamada, formulario o mensaje llega en el peor momento. La solucion no es contratar mas recepcionistas de inmediato; es crear una capa simple de respuesta, calificacion y seguimiento.',
            f'Una automatizacion enfocada en {keyword} debe capturar el nombre, necesidad, urgencia, ubicacion, horario preferido y consentimiento para seguimiento. Luego debe enviar el resumen correcto al equipo humano, no esconderlo en otra bandeja de entrada.',
            'El primer flujo recomendable es pequeno: respuesta instantanea, dos preguntas de calificacion, enlace de reserva o promesa clara de llamada, y alerta interna. Esa version se puede probar en una semana con llamadas perdidas, formularios web o WhatsApp Business.',
            'Las metricas que importan son tiempo hasta primer contacto, porcentaje de leads respondidos, citas reservadas, no-shows y valor estimado recuperado. Si esas metricas suben, se expande el flujo; si no, se corrige el guion antes de agregar complejidad.',
            'Operive instala este tipo de flujo practico para equipos locales que quieren mas clientes sin crear caos operativo. Empezamos con un proceso, medimos el resultado y luego ampliamos.'
        ]
    if locale == 'ar':
        return [
            f'تخسر شركات {category} في دالاس وفورت وورث فرصا عندما تصل مكالمة أو رسالة أو نموذج في وقت مزدحم. الحل العملي ليس توظيف فريق كبير فورا، بل بناء طبقة بسيطة للرد والتأهيل والمتابعة.',
            f'يجب أن تلتقط أتمتة {keyword} الاسم والحاجة ودرجة الاستعجال والموقع والوقت المناسب والموافقة على المتابعة. ثم ترسل ملخصا واضحا للفريق البشري بدلا من دفن العميل في صندوق وارد جديد.',
            'أفضل بداية هي تدفق صغير: رد فوري، سؤالان للتأهيل، رابط حجز أو وعد واضح بالاتصال، وتنبيه داخلي. يمكن اختبار هذه النسخة خلال أسبوع على المكالمات الفائتة أو نماذج الموقع أو واتساب للأعمال.',
            'المقاييس المهمة هي سرعة أول رد، نسبة العملاء الذين تمت متابعتهم، الحجوزات، الغياب، والقيمة المقدرة التي تم استعادتها. إذا تحسنت الأرقام نوسع النظام، وإذا لم تتحسن نصلح النص قبل إضافة التعقيد.',
            'تثبت أوبرايف هذه التدفقات العملية للشركات المحلية التي تريد المزيد من العملاء بدون فوضى تشغيلية. نبدأ بعملية واحدة، نقيس النتيجة، ثم نوسع.'
        ]
    return [
        f'{category.title()} teams in Dallas-Fort Worth lose revenue when a call, form, WhatsApp message, or booking request lands while staff are busy. The fastest fix is not a giant software rollout. It is a narrow response workflow that catches the lead, asks the right questions, and hands clean context to a human.',
        f'A strong {keyword} workflow captures name, service need, urgency, location, preferred time, and permission to follow up. It should answer immediately, qualify politely, and push a concise summary to the owner or front-desk team.',
        'Start with one measurable workflow: missed call text-back, website form follow-up, private-event intake, or appointment booking handoff. Keep it small enough to launch in days, then tune the script from real replies.',
        'Track speed to first response, response rate, booked appointments, no-shows, and estimated recovered revenue. If the numbers improve, expand the workflow. If they do not, fix the message and routing before adding more automation.',
        'Operive builds practical AI workflows for local businesses that want more captured leads without operational chaos. We start with one workflow, prove the result, and then expand into the next bottleneck.'
    ]

def page_html(slug, title, keyword, category, idx, locale='en'):
    pub = START + timedelta(days=idx)
    is_ar = locale == 'ar'
    lang_attr = ' lang="ar" dir="rtl"' if is_ar else f' lang="{locale}"'
    prefix = '' if locale == 'en' else f'/{locale}'
    t = slug_title(title, locale)
    desc = meta_desc(title, keyword, category, locale)
    h = html.escape(t)
    d = html.escape(desc)
    paragraphs = article_body(title, keyword, category, locale)
    labels = {'published':'Published', 'category':'Category', 'cta':'Want this installed for your business?', 'cta_body':'Book a 30-minute intake audit. Operive will find one workflow that can recover leads or reduce manual work this month.', 'book':'Book a call', 'back':'Back to blog'} if locale == 'en' else TRANSLATIONS[locale]
    p_html = '\n'.join(f'        <p>{html.escape(p)}</p>' for p in paragraphs)
    return f'''<!DOCTYPE html>
<html{lang_attr}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{h} | Operive</title>
    <meta name="description" content="{d}">
    <meta name="author" content="{html.escape(labels.get('author', AUTHOR))}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="{BASE}{prefix}/blog/{slug}/">
    <link rel="alternate" hreflang="en" href="{BASE}/blog/{slug}/">
    <link rel="alternate" hreflang="es" href="{BASE}/es/blog/{slug}/">
    <link rel="alternate" hreflang="ar" href="{BASE}/ar/blog/{slug}/">
    <link rel="alternate" hreflang="x-default" href="{BASE}/blog/{slug}/">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Operive">
    <meta property="og:title" content="{h}">
    <meta property="og:description" content="{d}">
    <meta property="og:url" content="{BASE}{prefix}/blog/{slug}/">
    <meta property="og:image" content="{BASE}/og-card.svg">
    <meta property="article:published_time" content="{pub.isoformat()}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/blog/seo-blog.css">
  </head>
  <body>
    <header class="site-header"><a href="{prefix or '/' if locale!='en' else '/'}" class="logo">Operive</a><nav><a href="{prefix}/blog/">Blog</a><a href="{prefix}/pricing/">Pricing</a><a href="https://calendly.com/operive/30min">Book</a></nav></header>
    <main class="article-shell">
      <a class="back" href="{prefix}/blog/">← {html.escape(labels['back'])}</a>
      <article>
        <p class="eyebrow">{html.escape(keyword)}</p>
        <h1>{h}</h1>
        <p class="dek">{d}</p>
        <div class="meta"><span>{html.escape(labels['published'])}: {pub.isoformat()}</span><span>{html.escape(labels['category'])}: {html.escape(category)}</span></div>
{p_html}
        <section class="cta"><h2>{html.escape(labels['cta'])}</h2><p>{html.escape(labels['cta_body'])}</p><a href="https://calendly.com/operive/30min">{html.escape(labels['book'])}</a></section>
      </article>
    </main>
  </body>
</html>
'''

def index_html(locale='en'):
    is_ar = locale == 'ar'
    lang_attr = ' lang="ar" dir="rtl"' if is_ar else f' lang="{locale}"'
    prefix = '' if locale == 'en' else f'/{locale}'
    if locale == 'en':
        title = 'Operive AI Workflow Blog'
        desc = 'Commercial-intent guides for Dallas-Fort Worth businesses that want faster intake, lead capture, and AI front desk workflows.'
        read = 'Read guide'
    else:
        title = TRANSLATIONS[locale]['blog_title']
        desc = TRANSLATIONS[locale]['blog_desc']
        read = TRANSLATIONS[locale]['read']
    cards = []
    for idx, (slug, art_title, keyword, category) in enumerate(ARTICLES):
        pub = START + timedelta(days=idx)
        cards.append(f'''<article class="card"><p>{html.escape(keyword)} · {pub.isoformat()}</p><h2><a href="{prefix}/blog/{slug}/">{html.escape(slug_title(art_title, locale))}</a></h2><p>{html.escape(meta_desc(art_title, keyword, category, locale))}</p><a class="read" href="{prefix}/blog/{slug}/">{html.escape(read)} →</a></article>''')
    return f'''<!DOCTYPE html>
<html{lang_attr}>
  <head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{html.escape(title)} | Operive</title><meta name="description" content="{html.escape(desc)}"><meta name="robots" content="index,follow">
    <link rel="canonical" href="{BASE}{prefix}/blog/">
    <link rel="alternate" hreflang="en" href="{BASE}/blog/"><link rel="alternate" hreflang="es" href="{BASE}/es/blog/"><link rel="alternate" hreflang="ar" href="{BASE}/ar/blog/"><link rel="alternate" hreflang="x-default" href="{BASE}/blog/">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/blog/seo-blog.css">
  </head>
  <body><header class="site-header"><a href="{prefix or '/'}" class="logo">Operive</a><nav><a href="{prefix}/services/">Services</a><a href="{prefix}/pricing/">Pricing</a><a href="https://calendly.com/operive/30min">Book</a></nav></header><main class="blog-index"><section class="hero"><p class="eyebrow">DFW AI workflow automation</p><h1>{html.escape(title)}</h1><p>{html.escape(desc)}</p></section><section class="grid">{''.join(cards)}</section></main></body>
</html>
'''

CSS = '''body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#111827;background:#f8faff;line-height:1.65}.site-header{display:flex;justify-content:space-between;align-items:center;padding:1rem clamp(1rem,4vw,3rem);background:#fff;border-bottom:1px solid #e5e7eb;position:sticky;top:0;z-index:2}.logo{font-weight:800;color:#1f3bff;text-decoration:none;font-size:1.25rem}.site-header nav{display:flex;gap:1rem;flex-wrap:wrap}.site-header a{color:#172033;text-decoration:none;font-weight:700}.blog-index,.article-shell{max-width:1120px;margin:0 auto;padding:clamp(2rem,5vw,5rem) 1rem}.hero{padding:3rem;border-radius:28px;background:linear-gradient(135deg,#091225,#1f3bff);color:#fff;margin-bottom:2rem}.hero h1{font-size:clamp(2.4rem,6vw,5rem);line-height:1;margin:0 0 1rem}.hero p{max-width:760px;color:#e7ebff}.eyebrow{font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#335cff}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}.card,article{background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:1.35rem;box-shadow:0 16px 45px rgba(17,24,39,.06)}.card h2{font-size:1.2rem;line-height:1.25}.card a,.read,.back{color:#1f3bff;font-weight:800;text-decoration:none}.article-shell article{max-width:840px;margin:1rem auto;padding:clamp(1.5rem,4vw,3rem)}h1{font-size:clamp(2.25rem,5vw,4.2rem);line-height:1.03;margin:.25rem 0 1rem}.dek{font-size:1.25rem;color:#475569}.meta{display:flex;gap:1rem;flex-wrap:wrap;color:#64748b;font-weight:700;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;padding:1rem 0;margin:1.5rem 0 2rem}.cta{background:#091225;color:#fff;border-radius:22px;padding:1.5rem;margin-top:2rem}.cta h2{margin-top:0}.cta p{color:#dbe4ff}.cta a{display:inline-flex;background:#fff;color:#1f3bff;border-radius:999px;padding:.8rem 1rem;text-decoration:none;font-weight:800}html[dir="rtl"] body{font-family:"IBM Plex Sans Arabic","Cairo",system-ui,sans-serif}'''

LEAD_QUERIES = [
    ['restaurant missed calls Dallas', 'restaurant', 'missed-call pain'],
    ['private event inquiry restaurant Fort Worth', 'restaurant', 'event inquiry follow-up'],
    ['HVAC emergency service Dallas contact', 'home services', 'after-hours intake'],
    ['plumber Fort Worth contact form', 'home services', 'lead response'],
    ['med spa consultation Dallas contact', 'med spa', 'consultation follow-up'],
    ['dental office new patient Dallas contact', 'healthcare', 'new-patient intake'],
    ['roofing estimate Dallas Fort Worth contact', 'home services', 'estimate follow-up'],
    ['garage door repair Dallas contact', 'home services', 'urgent service intake'],
    ['catering Dallas corporate events contact', 'restaurant', 'catering inquiry'],
    ['small business WhatsApp Dallas contact', 'local services', 'messaging automation'],
]

TASKS = [
    ('2026-07-15', 'Launch DFW lead monitor and review first batch of prospects', 'Owner', 'Run monitor, score leads, dedupe contacts'),
    ('2026-07-16', 'Approve first 20 personalized outreach drafts', 'CEO', 'External sending requires explicit approval'),
    ('2026-07-17', 'Send approved outreach wave 1 to restaurants/home services', 'Sales', 'Use Calendly CTA and one workflow-specific pain point'),
    ('2026-07-18', 'Publish/submit 30-page blog sitemap to Search Console', 'Marketing', 'Verify indexability and canonical/hreflang'),
    ('2026-07-20', 'Follow up with wave 1 non-responders', 'Sales', 'Short proof-oriented follow-up'),
    ('2026-07-22', 'Run founder local-network asks', 'CEO', 'Ask DFW operators for 3 intros to restaurants/home services'),
    ('2026-07-24', 'Book demos from replies and qualify budget/timing', 'Sales', 'Push qualified leads to 30-min call'),
    ('2026-07-27', 'Send proposal to best-fit prospect', 'CEO/Sales', 'Scope one workflow, 7-day install, clear price'),
    ('2026-07-31', 'Close first DFW client or document blockers', 'CEO', 'Signed agreement/payment required for acceptance'),
]

def ensure_blog():
    (ROOT / 'blog').mkdir(exist_ok=True)
    (ROOT / 'blog' / 'seo-blog.css').write_text(CSS)
    for loc in ['en','es','ar']:
        base = ROOT if loc == 'en' else ROOT / loc
        (base / 'blog').mkdir(parents=True, exist_ok=True)
        (base / 'blog' / 'index.html').write_text(index_html(loc))
        for idx, data in enumerate(ARTICLES):
            slug = data[0]
            out = base / 'blog' / slug / 'index.html'
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(page_html(*data, idx=idx, locale=loc))

def write_assets():
    mdir = ROOT / 'marketing' / 'dfw-lead-monitor'
    mdir.mkdir(parents=True, exist_ok=True)
    with (mdir / 'seed_queries.csv').open('w', newline='') as f:
        w=csv.writer(f); w.writerow(['query','segment','signal']); w.writerows(LEAD_QUERIES)
    with (mdir / 'reverse_prompt_action_plan.csv').open('w', newline='') as f:
        w=csv.writer(f); w.writerow(['date','action','owner','note']); w.writerows(TASKS)
    prospects = [
        ['Dallas restaurant group with private dining page','restaurant','event/catering inquiries need fast follow-up','Find owner/operator email from website before outreach','draft only'],
        ['Fort Worth independent HVAC company','home services','after-hours emergency calls and quote requests','Verify service area + contact form','draft only'],
        ['Plano med spa with consultation forms','med spa','consultation no-shows and delayed follow-up','Verify booking workflow','draft only'],
        ['Arlington roofing contractor','home services','storm/estimate lead speed-to-lead','Verify phone/form path','draft only'],
        ['Dallas catering company','restaurant','corporate inquiry qualification','Verify event inquiry page','draft only'],
    ]
    with (mdir / 'seed_prospects.csv').open('w', newline='') as f:
        w=csv.writer(f); w.writerow(['prospect_type','segment','automation_angle','verification_needed','status']); w.writerows(prospects)
    monitor = '''# DFW AI workflow lead monitor\n\nRuns as a Hermes cron job every 6 hours. It searches DFW commercial-intent signals, scores prospects, and appends findings to this folder. No outreach is sent without CEO approval.\n\nInputs:\n- seed_queries.csv\n\nOutputs expected from cron:\n- leads.csv\n- daily-review.md\n\nQualification score:\n- +3 DFW-local business\n- +3 segment fit: restaurant, home services, med spa, dental, local services\n- +2 visible phone/form/booking workflow\n- +2 signal of missed calls, hiring front desk, slow response, events/catering, emergency service, after-hours\n- +1 owner/operator contact path\n\nNext step after review: draft 1:1 outreach, then request CEO approval before any external send.\n'''
    (mdir / 'README.md').write_text(monitor)
    with (ROOT / 'marketing' / 'seo_keyword_pipeline.csv').open('w', newline='') as f:
        w=csv.writer(f); w.writerow(['slug','primary_keyword','segment','publish_date','status'])
        for i,(slug,title,keyword,category) in enumerate(ARTICLES):
            w.writerow([slug, keyword, category, (START+timedelta(days=i)).isoformat(), 'published-static-page'])

def update_sitemap():
    sm_ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
    xhtml_ns = 'http://www.w3.org/1999/xhtml'
    ET.register_namespace('', sm_ns)
    ET.register_namespace('xhtml', xhtml_ns)
    sitemap_path = ROOT / 'sitemap-0.xml'
    existing = []
    seen = set()
    if sitemap_path.exists():
        root = ET.fromstring(sitemap_path.read_text())
        for url in root.findall(f'{{{sm_ns}}}url'):
            loc_el = url.find(f'{{{sm_ns}}}loc')
            if loc_el is not None and loc_el.text and loc_el.text not in seen:
                existing.append(url)
                seen.add(loc_el.text)

    def make_url(loc, alternates=None):
        node = ET.Element(f'{{{sm_ns}}}url')
        loc_el = ET.SubElement(node, f'{{{sm_ns}}}loc')
        loc_el.text = loc
        for lang, href in alternates or []:
            ET.SubElement(node, f'{{{xhtml_ns}}}link', {'rel': 'alternate', 'hreflang': lang, 'href': href})
        return node

    def add_locale_group(path):
        alternates = [
            ('en', f'{BASE}/{path}/'),
            ('es', f'{BASE}/es/{path}/'),
            ('ar', f'{BASE}/ar/{path}/'),
            ('x-default', f'{BASE}/{path}/'),
        ]
        for _lang, loc in alternates[:3]:
            if loc not in seen:
                existing.append(make_url(loc, alternates))
                seen.add(loc)

    add_locale_group('blog')
    for slug, *_ in ARTICLES:
        if not (ROOT / 'blog' / slug / 'index.html').exists():
            raise FileNotFoundError(f'Missing English blog page for {slug}')
        if not (ROOT / 'es' / 'blog' / slug / 'index.html').exists():
            raise FileNotFoundError(f'Missing Spanish blog page for {slug}')
        if not (ROOT / 'ar' / 'blog' / slug / 'index.html').exists():
            raise FileNotFoundError(f'Missing Arabic blog page for {slug}')
        add_locale_group(f'blog/{slug}')

    root = ET.Element(f'{{{sm_ns}}}urlset')
    for url in existing:
        root.append(url)
    sitemap_path.write_text('<?xml version="1.0" encoding="UTF-8"?>' + ET.tostring(root, encoding='unicode', short_empty_elements=True))

def main():
    ensure_blog(); write_assets(); update_sitemap()
    manifest = {'articles_per_locale': len(ARTICLES), 'localized_pages_created': len(ARTICLES)*3 + 3, 'assets': ['marketing/dfw-lead-monitor/README.md','marketing/dfw-lead-monitor/seed_queries.csv','marketing/dfw-lead-monitor/reverse_prompt_action_plan.csv','marketing/seo_keyword_pipeline.csv']}
    (ROOT/'marketing'/'dfw-lead-monitor'/'launch_manifest.json').write_text(json.dumps(manifest, indent=2))
    print(json.dumps(manifest, indent=2))

if __name__ == '__main__':
    main()
