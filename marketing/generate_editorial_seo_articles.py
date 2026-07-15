from __future__ import annotations

import csv
import html
import json
import re
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path

ROOT = Path('/Users/zaidai/Operive-dashboard')
BASE = 'https://www.operive.com'
CALENDAR = ROOT / 'marketing' / 'editorial_calendar_operive_blog.csv'
OUT_STATUS = ROOT / 'marketing' / 'seo_article_publish_status.csv'
SOCIAL = ROOT / 'marketing' / 'seo_article_social_snippets.csv'
AUTHOR = 'Noah Adam'
AUTHORITY_URL = 'https://www.sba.gov/business-guide/manage-your-business'

LABELS = {
    'en': {
        'blog_title': 'Operive AI Workflow Blog',
        'blog_desc': 'Commercial-intent guides for Dallas-Fort Worth businesses that want faster intake, lead capture, and practical AI workflows.',
        'read': 'Read guide', 'published': 'Published', 'category': 'Category', 'back': 'Back to blog',
        'book': 'Book a 30-minute workflow audit', 'cta_title': 'Want this installed for your business?',
        'cta_body': 'Operive maps one revenue-sensitive workflow, launches the first automation, and measures whether leads are captured faster.',
        'authority': 'The U.S. Small Business Administration recommends clear operating systems and repeatable processes as companies grow.',
        'hero_alt': 'Operive AI workflow map for local business intake and follow-up', 'toc': 'What this guide covers',
    },
    'es': {
        'blog_title': 'Blog de automatización de Operive',
        'blog_desc': 'Guías comerciales para negocios de Dallas-Fort Worth que quieren mejorar intake, seguimiento y flujos prácticos con IA.',
        'read': 'Leer guía', 'published': 'Publicado', 'category': 'Categoría', 'back': 'Volver al blog',
        'book': 'Reservar auditoría de 30 minutos', 'cta_title': '¿Quieres instalar esto en tu negocio?',
        'cta_body': 'Operive mapea un flujo sensible a ingresos, lanza la primera automatización y mide si los leads se capturan más rápido.',
        'authority': 'La U.S. Small Business Administration recomienda sistemas operativos claros y procesos repetibles a medida que una empresa crece.',
        'hero_alt': 'Mapa de flujo de IA de Operive para intake y seguimiento de negocios locales', 'toc': 'Qué cubre esta guía',
    },
    'ar': {
        'blog_title': 'مدونة أوبرايف لأتمتة سير العمل',
        'blog_desc': 'أدلة تجارية لشركات دالاس وفورت وورث التي تريد استقبال عملاء أسرع ومتابعة أوضح وسير عمل عملي بالذكاء الاصطناعي.',
        'read': 'اقرأ الدليل', 'published': 'تاريخ النشر', 'category': 'الفئة', 'back': 'العودة إلى المدونة',
        'book': 'احجز تدقيقا لمدة 30 دقيقة', 'cta_title': 'هل تريد تركيب هذا في شركتك؟',
        'cta_body': 'ترسم أوبرايف سير عمل مرتبطا بالإيرادات، وتطلق أول أتمتة، وتقيس ما إذا كانت العملاء المحتملون يلتقطون بسرعة أكبر.',
        'authority': 'توصي إدارة الأعمال الصغيرة الأمريكية بأنظمة تشغيل واضحة وعمليات قابلة للتكرار مع نمو الشركات.',
        'hero_alt': 'خريطة سير عمل أوبرايف بالذكاء الاصطناعي لاستقبال العملاء والمتابعة', 'toc': 'ما الذي يغطيه هذا الدليل',
    },
}

CSS_APPEND = '''
.article-hero-img{width:100%;max-height:280px;object-fit:cover;border-radius:22px;border:1px solid #e5e7eb;background:#eef2ff;margin:1rem 0}.toc{background:#f8faff;border:1px solid #e5e7eb;border-radius:18px;padding:1rem;margin:1.5rem 0}.toc a{color:#1f3bff;font-weight:700;text-decoration:none}.authority-link{border-left:4px solid #1f3bff;padding-left:1rem;background:#f8faff;border-radius:12px}.social-note{font-size:.95rem;color:#64748b}.internal-links{display:grid;gap:.75rem;margin:1.5rem 0}.internal-links a{display:block;border:1px solid #e5e7eb;border-radius:14px;padding:.8rem;color:#1f3bff;text-decoration:none;font-weight:800}html[dir="rtl"] .authority-link{border-left:0;border-right:4px solid #1f3bff;padding-left:0;padding-right:1rem}
'''


def title_case_keyword(keyword: str) -> str:
    keep = {'AI', 'DFW', 'CRM'}
    return ' '.join(w if w.upper() in keep else w.capitalize() for w in keyword.split())


def load_calendar(limit=30):
    with CALENDAR.open(newline='') as f:
        rows = list(csv.DictReader(f))
    return rows[:limit]


def first_words(text: str, n=28):
    words = re.sub(r'<[^>]+>', ' ', text).split()
    return ' '.join(words[:n])


def meta_desc(row, locale):
    kw = row['primary_keyword']
    if locale == 'es':
        return f'Guía comercial sobre {kw} para equipos de Dallas-Fort Worth que necesitan captar leads, responder rápido y medir el retorno sin crear caos operativo.'
    if locale == 'ar':
        return f'دليل تجاري حول {kw} لفرق دالاس وفورت وورث التي تحتاج إلى التقاط العملاء المحتملين والرد بسرعة وقياس العائد بدون فوضى تشغيلية.'
    return f'Commercial guide to {kw} for Dallas-Fort Worth teams that need faster lead capture, cleaner follow-up, and measurable AI workflow ROI.'


def localized_title(row, locale):
    kw = row['primary_keyword']
    if locale == 'es':
        return f'{kw}: guía comercial para negocios de Dallas-Fort Worth'
    if locale == 'ar':
        return f'{kw}: دليل تجاري لشركات دالاس وفورت وورث'
    return title_case_keyword(kw)


def sections(row, locale):
    kw = row['primary_keyword']
    pillar = row['topic_pillar']
    template = row['template']
    base = {
        'en': [
            ('Why this keyword matters now', [
                f'{kw} is a buying-intent search, not a casual research phrase. A local owner searching it is usually trying to decide who can remove a real bottleneck: missed calls, slow form follow-up, scattered WhatsApp messages, manual quoting, or front-desk overload. For Operive, that makes the page useful only if it explains the business problem, the install path, and the numbers a buyer should watch.',
                f'The practical version of {pillar.lower()} starts with one workflow. A Dallas team does not need a broad transformation project before it can capture more leads. It needs a response layer that notices a customer request, asks the next useful question, routes the summary to a human, and records the outcome so the owner can see whether the workflow paid for itself.',
                f'This guide is written for operators comparing {kw} options in Dallas-Fort Worth. It avoids platform hype and focuses on the decisions that determine whether an automation actually gets used by staff: channel coverage, handoff rules, escalation, reporting, and a simple launch scope.'
            ]),
            ('The workflow to install first', [
                f'The first workflow should sit as close as possible to revenue. For most small businesses, that means missed-call text-back, website form follow-up, booking handoff, quote intake, or private-event inquiry routing. The workflow should capture the customer name, service need, urgency, location, preferred time, and consent for follow-up before a human spends time chasing context.',
                f'A strong {kw} implementation answers quickly without pretending the business is fully automated. The AI can greet the lead, ask two or three qualifying questions, offer a booking link when appropriate, and then send a concise internal summary. The human team should see the original message, the extracted fields, recommended next action, and any risk flag such as an upset customer or urgent service need.',
                'Start narrow. Launch one channel, one trigger, one script, and one owner. When the workflow consistently captures cleaner information, add the next channel. That sequencing keeps staff trust high because the system improves a painful task instead of introducing another dashboard.'
            ]),
            ('Buyer checklist for Dallas-Fort Worth teams', [
                f'Before buying {kw}, confirm which channels matter: phone, SMS, WhatsApp, Telegram, website forms, booking pages, or CRM tasks. Then document the exact handoff rule. A lead should never disappear into an inbox that nobody owns. Every automation needs a destination, a response-time expectation, and a fallback if the bot is uncertain.',
                'The second checklist item is measurement. Track speed to first response, response rate, booked appointments, no-shows, recovered missed leads, and manual hours saved. A workflow that cannot show those numbers may still feel impressive, but it will be hard to defend after the launch excitement fades.',
                'The third item is tone and escalation. Local businesses win trust by being helpful and specific. The script should sound like the business, avoid overpromising, and escalate pricing disputes, complaints, emergencies, or custom requests to a person quickly.'
            ]),
            ('Implementation plan and timeline', [
                f'A realistic {kw} rollout can start in days when the scope is tight. Day one maps the lead path and decides what good intake looks like. Day two drafts the script, escalation rules, and internal alert format. Day three connects the first channel. Day four tests edge cases. Day five launches with owner review and a simple scorecard.',
                'For a how-to project, the highest-leverage work is not the integration itself; it is deciding what information must be captured before a lead is worth human time. For an industry-guide or case-study page, the same rule applies: the best proof is a shorter response time, more complete lead records, and more booked conversations from the same demand.',
                f'Operive usually recommends a 7-day first install for {template} opportunities: map one bottleneck, launch one workflow, review real customer messages, and improve the script after the first batch of replies. That creates momentum without locking the business into a large platform migration.'
            ]),
            ('How Operive approaches the work', [
                f'Operive builds practical AI workflows for small businesses that need results, not theater. For {kw}, the goal is to capture more real opportunities and reduce repetitive admin while preserving the human judgment that closes deals.',
                'The engagement starts with an intake audit. We inspect missed calls, contact forms, WhatsApp or Telegram messages, booking handoffs, and follow-up habits. Then we choose one workflow that can produce a measurable lift this month. The first version is intentionally small, monitored, and easy for staff to override.',
                'Once the first workflow proves useful, the next step is expansion: CRM updates, multi-channel follow-up, reporting, and owner alerts. The system earns complexity only after it earns trust.'
            ]),
            ('Common mistakes to avoid', [
                f'The most common mistake with {kw} is buying a platform before naming the operational leak. A tool cannot fix a handoff nobody owns, a booking rule nobody follows, or a lead source nobody reviews. Before launch, the business should write down the exact moment a customer becomes qualified, who receives the alert, what response time is acceptable, and what happens when the automation is uncertain.',
                'The second mistake is measuring activity instead of business lift. Message volume, bot replies, or dashboard logins do not matter unless they improve the path from inquiry to booked conversation. A useful rollout reports the few numbers an owner can act on each week: missed leads recovered, average response time, qualified conversations, appointments booked, and manual follow-up hours removed.'
            ]),
            ('Frequently asked buying questions', [
                f'How much should a team automate on day one? For {kw}, the answer is less than most vendors suggest. The first release should handle the repetitive front edge of the conversation and leave judgment-heavy decisions to people. That usually means greeting the lead, collecting the core details, setting a response expectation, creating a clean internal alert, and logging the outcome. When that narrow loop works, the team can safely add quoting support, CRM enrichment, reminders, and reactivation campaigns.',
                'What if customers know they are talking to automation? That is usually fine when the experience is fast, honest, and useful. Problems happen when a bot pretends to be a person, hides limitations, or traps the customer in a loop. The better approach is to say enough to be helpful, ask only questions the business truly needs, and escalate quickly when the request is sensitive, urgent, or outside the script.',
                'What systems need to connect? Most first installs can work with the tools the business already uses: the website form, phone/SMS provider, WhatsApp Business, Telegram, email, booking calendar, spreadsheet, or CRM. The integration plan should follow the money path. If booked appointments drive revenue, connect booking first. If missed calls are the leak, connect call events and SMS first. If long quote forms are the bottleneck, connect form intake and owner alerts first.',
                'How should ROI be reviewed? Compare the period before and after launch using the same lead sources. Look at response time, total leads answered, qualified conversations, booked calls, show rate, revenue from recovered leads, and manual hours saved. A workflow does not need perfect attribution to be useful, but it does need a simple scoreboard that the owner trusts.',
                f'When should a Dallas-Fort Worth business choose Operive for {kw}? Choose Operive when the problem is operational and immediate: leads are slipping, staff are repeating the same answers, follow-up is inconsistent, or the owner cannot see which inquiries are being handled. Operive is a fit when the business wants a practical install, clear reporting, and a first workflow that can launch before a large software project would even finish discovery.',
                'What should be avoided? Avoid launching every channel at once, replacing human review before the script is proven, or measuring only vanity activity. The safest first project has one owner, one weekly review, and one clear decision: keep the workflow, revise it, or remove it. That discipline protects staff time and keeps automation tied to business outcomes instead of novelty.'
            ]),
        ],
        'es': [
            ('Por qué importa esta búsqueda', [
                f'{kw} es una búsqueda con intención comercial. El dueño normalmente intenta resolver llamadas perdidas, formularios sin respuesta, mensajes dispersos o sobrecarga del equipo de recepción.',
                f'La versión práctica de {pillar.lower()} empieza con un flujo, no con una transformación enorme. El objetivo es responder, calificar, resumir y entregar el contexto correcto al humano responsable.',
                'Esta guía ayuda a comparar opciones en Dallas-Fort Worth con enfoque en canales, reglas de handoff, medición y lanzamiento simple.'
            ]),
            ('El primer flujo recomendado', [
                f'El primer flujo de {kw} debe estar cerca de ingresos: llamadas perdidas, formularios web, reservas, cotizaciones o mensajes de WhatsApp.',
                'Debe capturar nombre, necesidad, urgencia, ubicación, horario preferido y consentimiento para seguimiento, y luego enviar un resumen interno claro.',
                'Empieza estrecho: un canal, un disparador, un guion y un dueño operativo.'
            ]),
            ('Checklist de compra', [
                'Confirma canales, reglas de escalamiento, destino interno, métricas y tono de marca antes de comprar.',
                'Mide velocidad de respuesta, citas reservadas, leads recuperados y horas manuales ahorradas.',
                'Escala quejas, emergencias, disputas de precio y casos inciertos a una persona.'
            ]),
            ('Plan de implementación', [
                'Un primer lanzamiento puede completarse en días: mapear, escribir guion, conectar canal, probar casos límite y lanzar con scorecard.',
                'La clave es definir qué información hace que un lead esté listo para seguimiento humano.',
                'Operive recomienda una primera instalación de 7 días para probar valor antes de expandir.'
            ]),
            ('Cómo trabaja Operive', [
                'Operive instala flujos prácticos que capturan más oportunidades sin crear caos operativo.',
                'Empezamos con una auditoría de intake y elegimos un flujo medible para este mes.',
                'Después expandimos a CRM, seguimiento multicanal, reportes y alertas.'
            ]),
            ('Errores comunes que conviene evitar', [
                f'El error más común con {kw} es comprar una plataforma antes de definir la fuga operativa. Primero hay que nombrar cuándo un lead está calificado, quién recibe la alerta, qué tiempo de respuesta se espera y qué pasa cuando la automatización no está segura.',
                'El segundo error es medir actividad en vez de mejora comercial. Lo que importa es leads recuperados, tiempo promedio de respuesta, conversaciones calificadas, citas reservadas y horas manuales eliminadas.'
            ]),
        ],
        'ar': [
            ('لماذا تهم هذه العبارة', [
                f'{kw} عبارة بحث تجارية. غالبا ما يحاول صاحب العمل حل مشكلة مكالمات فائتة أو نماذج بلا رد أو رسائل متفرقة أو ضغط على فريق الاستقبال.',
                f'النسخة العملية من {pillar} تبدأ بسير عمل واحد: رد سريع، تأهيل، ملخص واضح، وتسليم للفريق البشري.',
                'يساعد هذا الدليل شركات دالاس وفورت وورث على مقارنة الخيارات من خلال القنوات وقواعد التسليم والقياس ونطاق الإطلاق.'
            ]),
            ('سير العمل الأول', [
                f'يجب أن يكون أول سير عمل في {kw} قريبا من الإيرادات: مكالمات فائتة، نماذج موقع، حجوزات، عروض سعر، أو رسائل واتساب.',
                'يلتقط الاسم والحاجة ودرجة الاستعجال والموقع والوقت المناسب والموافقة على المتابعة، ثم يرسل ملخصا داخليا واضحا.',
                'ابدأ بنطاق ضيق: قناة واحدة، محفز واحد، نص واحد، ومسؤول واضح.'
            ]),
            ('قائمة فحص الشراء', [
                'حدد القنوات وقواعد التصعيد والوجهة الداخلية والمقاييس ونبرة العلامة قبل الشراء.',
                'قس سرعة أول رد، الحجوزات، العملاء المستعادين، والساعات اليدوية التي تم توفيرها.',
                'صعّد الشكاوى والطوارئ ونزاعات السعر والحالات غير الواضحة إلى شخص مسؤول.'
            ]),
            ('خطة التنفيذ', [
                'يمكن إطلاق النسخة الأولى خلال أيام: رسم المسار، كتابة النص، ربط القناة، اختبار الحالات الصعبة، ثم الإطلاق بلوحة قياس.',
                'الأهم هو تحديد المعلومات التي تجعل العميل المحتمل جاهزا للمتابعة البشرية.',
                'توصي أوبرايف بأول تركيب خلال 7 أيام لإثبات القيمة قبل التوسع.'
            ]),
            ('كيف تعمل أوبرايف', [
                'تركب أوبرايف سير عمل عملي يلتقط فرصا أكثر بدون فوضى تشغيلية.',
                'نبدأ بتدقيق استقبال العملاء ونختار سير عمل واحدا قابلا للقياس هذا الشهر.',
                'بعد النجاح نوسع إلى CRM والمتابعة متعددة القنوات والتقارير والتنبيهات.'
            ]),
            ('أخطاء شائعة يجب تجنبها', [
                f'الخطأ الأكثر شيوعا في {kw} هو شراء منصة قبل تحديد التسرب التشغيلي. يجب أولا تحديد متى يصبح العميل المحتمل مؤهلا، ومن يستلم التنبيه، وما زمن الرد المتوقع، وماذا يحدث عندما تكون الأتمتة غير متأكدة.',
                'الخطأ الثاني هو قياس النشاط بدلا من الأثر التجاري. الأرقام المهمة هي العملاء المستعادون، ومتوسط زمن الرد، والمحادثات المؤهلة، والحجوزات، والساعات اليدوية التي أزيلت من العمل اليومي.'
            ]),
        ],
    }
    return base[locale]


def article_html(row, locale):
    slug = row['publish_url'].rstrip('/').split('/')[-1]
    prefix = '' if locale == 'en' else f'/{locale}'
    is_ar = locale == 'ar'
    lang_attr = ' lang="ar" dir="rtl"' if is_ar else f' lang="{locale}"'
    labels = LABELS[locale]
    title = localized_title(row, locale)
    desc = meta_desc(row, locale)
    canonical = f'{BASE}{prefix}/blog/{slug}/'
    headings = sections(row, locale)
    intro = f"{row['primary_keyword']} is a commercial-intent topic for Dallas-Fort Worth operators who need faster intake, clearer follow-up, and a workflow that staff will actually use. This guide explains what to automate first, what to measure, and how Operive installs the first practical version without forcing a full software migration."
    if locale == 'es':
        intro = f"{row['primary_keyword']} es un tema comercial para operadores de Dallas-Fort Worth que necesitan intake más rápido, seguimiento claro y un flujo que el equipo realmente use. Esta guía explica qué automatizar primero, qué medir y cómo Operive instala una primera versión práctica sin forzar una migración completa."
    if locale == 'ar':
        intro = f"{row['primary_keyword']} موضوع تجاري لشركات دالاس وفورت وورث التي تحتاج إلى استقبال أسرع ومتابعة أوضح وسير عمل يستخدمه الفريق فعلا. يشرح هذا الدليل ما يجب أتمتته أولا، وما يجب قياسه، وكيف تركب أوبرايف النسخة العملية الأولى بدون ترحيل كامل للأنظمة."
    body_parts = [f'<p>{html.escape(intro)}</p>']
    body_parts.append('<nav class="toc"><strong>'+html.escape(labels['toc'])+'</strong><ul>' + ''.join(f'<li><a href="#{re.sub(r"[^a-z0-9]+", "-", h.lower()).strip("-")}">{html.escape(h)}</a></li>' for h,_ in headings) + '</ul></nav>')
    for h, paras in headings:
        hid = re.sub(r'[^a-z0-9]+', '-', h.lower()).strip('-')
        body_parts.append(f'<h2 id="{hid}">{html.escape(h)}</h2>')
        body_parts.extend(f'<p>{html.escape(p)}</p>' for p in paras)
    body_parts.append(f'<p class="authority-link">{html.escape(labels["authority"])} <a href="{AUTHORITY_URL}" rel="nofollow noopener">SBA business operations guide</a>.</p>')
    body_parts.append('<section class="internal-links"><a href="/services/">Operive services</a><a href="/pricing/">Operive pricing</a><a href="/blog/">More Operive workflow guides</a></section>')
    body = '\n'.join(body_parts)
    article_schema = {
        '@context': 'https://schema.org', '@type': 'Article', 'headline': title, 'description': desc,
        'author': {'@type': 'Person', 'name': AUTHOR}, 'publisher': {'@type': 'Organization', 'name': 'Operive', 'url': BASE},
        'datePublished': row['publish_date'], 'dateModified': row['publish_date'], 'mainEntityOfPage': canonical,
        'image': f'{BASE}/og-card.svg', 'inLanguage': 'ar' if locale == 'ar' else locale,
    }
    breadcrumb_schema = {'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Blog','item':f'{BASE}{prefix}/blog/'},{'@type':'ListItem','position':2,'name':title,'item':canonical}]}
    return f'''<!DOCTYPE html>
<html{lang_attr}>
  <head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{html.escape(title)} | Operive</title>
    <meta name="description" content="{html.escape(desc)}"><meta name="author" content="{AUTHOR}"><meta name="robots" content="index,follow">
    <link rel="canonical" href="{canonical}">
    <link rel="alternate" hreflang="en" href="{BASE}/blog/{slug}/"><link rel="alternate" hreflang="es" href="{BASE}/es/blog/{slug}/"><link rel="alternate" hreflang="ar" href="{BASE}/ar/blog/{slug}/"><link rel="alternate" hreflang="x-default" href="{BASE}/blog/{slug}/">
    <meta property="og:type" content="article"><meta property="og:site_name" content="Operive"><meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{BASE}/og-card.svg"><meta property="article:published_time" content="{row['publish_date']}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/blog/seo-blog.css">
    <script type="application/ld+json">{json.dumps(article_schema, ensure_ascii=False)}</script><script type="application/ld+json">{json.dumps(breadcrumb_schema, ensure_ascii=False)}</script>
  </head>
  <body><header class="site-header"><a href="{prefix or '/'}" class="logo">Operive</a><nav><a href="{prefix}/services/">Services</a><a href="{prefix}/pricing/">Pricing</a><a href="https://calendly.com/operive/30min">Book</a></nav></header>
    <main class="article-shell"><a class="back" href="{prefix}/blog/">← {html.escape(labels['back'])}</a><article>
      <p class="eyebrow">{html.escape(row['primary_keyword'])}</p><h1>{html.escape(title)}</h1><p class="dek">{html.escape(desc)}</p>
      <img class="article-hero-img" src="/og-card.svg" alt="{html.escape(labels['hero_alt'] + ': ' + row['primary_keyword'])}">
      <div class="meta"><span>{html.escape(labels['published'])}: {row['publish_date']}</span><span>{html.escape(labels['category'])}: {html.escape(row['topic_pillar'])}</span></div>
      {body}
      <section class="cta"><h2>{html.escape(labels['cta_title'])}</h2><p>{html.escape(labels['cta_body'])}</p><a href="https://calendly.com/operive/30min">{html.escape(labels['book'])}</a></section>
    </article></main>
  </body>
</html>
'''


def index_html(rows, locale):
    prefix = '' if locale == 'en' else f'/{locale}'
    lang_attr = ' lang="ar" dir="rtl"' if locale == 'ar' else f' lang="{locale}"'
    labels = LABELS[locale]
    cards = []
    for row in rows:
        slug = row['publish_url'].rstrip('/').split('/')[-1]
        title = localized_title(row, locale)
        desc = meta_desc(row, locale)
        cards.append(f'<article class="card"><p>{html.escape(row["primary_keyword"])} · {row["publish_date"]}</p><h2><a href="{prefix}/blog/{slug}/">{html.escape(title)}</a></h2><p>{html.escape(desc)}</p><a class="read" href="{prefix}/blog/{slug}/">{html.escape(labels["read"])} →</a></article>')
    return f'''<!DOCTYPE html><html{lang_attr}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{html.escape(labels['blog_title'])} | Operive</title><meta name="description" content="{html.escape(labels['blog_desc'])}"><meta name="robots" content="index,follow"><link rel="canonical" href="{BASE}{prefix}/blog/"><link rel="alternate" hreflang="en" href="{BASE}/blog/"><link rel="alternate" hreflang="es" href="{BASE}/es/blog/"><link rel="alternate" hreflang="ar" href="{BASE}/ar/blog/"><link rel="alternate" hreflang="x-default" href="{BASE}/blog/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/blog/seo-blog.css"></head><body><header class="site-header"><a href="{prefix or '/'}" class="logo">Operive</a><nav><a href="{prefix}/services/">Services</a><a href="{prefix}/pricing/">Pricing</a><a href="https://calendly.com/operive/30min">Book</a></nav></header><main class="blog-index"><section class="hero"><p class="eyebrow">DFW AI workflow automation</p><h1>{html.escape(labels['blog_title'])}</h1><p>{html.escape(labels['blog_desc'])}</p></section><section class="grid">{''.join(cards)}</section></main></body></html>'''


def ensure_css():
    css_path = ROOT / 'blog' / 'seo-blog.css'
    css_path.parent.mkdir(exist_ok=True)
    css = css_path.read_text() if css_path.exists() else ''
    if '.article-hero-img' not in css:
        css_path.write_text(css.rstrip() + '\n' + CSS_APPEND)


def update_sitemap(rows):
    sm_ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'; xhtml_ns = 'http://www.w3.org/1999/xhtml'
    ET.register_namespace('', sm_ns); ET.register_namespace('xhtml', xhtml_ns)
    sitemap_path = ROOT / 'sitemap-0.xml'
    existing = []; seen = set()
    if sitemap_path.exists():
        root = ET.fromstring(sitemap_path.read_text())
        for url in root.findall(f'{{{sm_ns}}}url'):
            loc = url.find(f'{{{sm_ns}}}loc')
            if loc is not None and loc.text and loc.text not in seen:
                existing.append(url); seen.add(loc.text)
    def make_url(loc, alternates):
        node = ET.Element(f'{{{sm_ns}}}url'); ET.SubElement(node, f'{{{sm_ns}}}loc').text = loc
        for lang, href in alternates:
            ET.SubElement(node, f'{{{xhtml_ns}}}link', {'rel':'alternate','hreflang':lang,'href':href})
        return node
    def add_group(path):
        alts = [('en', f'{BASE}/{path}/'), ('es', f'{BASE}/es/{path}/'), ('ar', f'{BASE}/ar/{path}/'), ('x-default', f'{BASE}/{path}/')]
        for _, loc in alts[:3]:
            if loc not in seen:
                existing.append(make_url(loc, alts)); seen.add(loc)
    add_group('blog')
    for row in rows:
        slug = row['publish_url'].rstrip('/').split('/')[-1]
        add_group(f'blog/{slug}')
    root = ET.Element(f'{{{sm_ns}}}urlset')
    for url in existing: root.append(url)
    sitemap_path.write_text('<?xml version="1.0" encoding="UTF-8"?>' + ET.tostring(root, encoding='unicode', short_empty_elements=True))


def write_outputs(rows):
    ensure_css()
    for locale in ['en', 'es', 'ar']:
        base = ROOT if locale == 'en' else ROOT / locale
        (base / 'blog').mkdir(parents=True, exist_ok=True)
        (base / 'blog' / 'index.html').write_text(index_html(rows, locale))
        for row in rows:
            slug = row['publish_url'].rstrip('/').split('/')[-1]
            out = base / 'blog' / slug / 'index.html'
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(article_html(row, locale))
    with OUT_STATUS.open('w', newline='') as f:
        fields = ['publish_date','keyword_id','primary_keyword','slug','url','status','gsc_indexing_status','notes']
        w = csv.DictWriter(f, fieldnames=fields); w.writeheader()
        for row in rows:
            slug = row['publish_url'].rstrip('/').split('/')[-1]
            w.writerow({'publish_date':row['publish_date'],'keyword_id':row['keyword_id'],'primary_keyword':row['primary_keyword'],'slug':slug,'url':row['publish_url'],'status':'generated-ready-for-review','gsc_indexing_status':'not-submitted-no-gsc-access','notes':'English, Spanish, and Arabic pages generated with Article schema, hreflang, internal links, external authority link, CTA, and image alt text.'})
    with SOCIAL.open('w', newline='') as f:
        fields = ['publish_date','keyword','url','linkedin_snippet','twitter_snippet']
        w = csv.DictWriter(f, fieldnames=fields); w.writeheader()
        for row in rows:
            kw = row['primary_keyword']; url = row['publish_url']
            w.writerow({'publish_date':row['publish_date'],'keyword':kw,'url':url,'linkedin_snippet':f'New Operive guide: {kw}. A practical breakdown of the first workflow to automate, what to measure, and how DFW teams can capture leads faster without adding operational chaos. {url}','twitter_snippet':f'New guide: {kw}. What to automate first, how to measure it, and how DFW teams can capture leads faster. {url}'})
    update_sitemap(rows)


def main():
    rows = load_calendar(30)
    write_outputs(rows)
    print(json.dumps({'articles': len(rows), 'localized_pages': len(rows)*3, 'status_csv': str(OUT_STATUS), 'social_csv': str(SOCIAL)}, indent=2))

if __name__ == '__main__':
    main()
