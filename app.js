document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const LOCALE_STORAGE_KEY = 'operive-locale';
const localeManifest = {
  defaultLocale: 'en',
  supportedLocales: ['en', 'ar'],
  rtlLocales: ['ar'],
  localeLabels: {
    en: 'EN',
    ar: 'AR',
  },
  countryLocaleMap: {
    AE: 'ar', SA: 'ar', EG: 'ar', QA: 'ar', KW: 'ar', BH: 'ar', OM: 'ar', JO: 'ar', MA: 'ar', DZ: 'ar', TN: 'ar', IQ: 'ar',
  },
};

const homeTranslations = {
  en: {
    navHome: 'Home',
    navServices: 'Services',
    navHow: 'How It Works',
    navUseCases: 'Use Cases',
    navIndustries: 'Industries',
    navTrust: 'Trust and Safety',
    navAbout: 'About',
    navContact: 'Contact',
    selectorLabel: 'EN / AR',
    navSecondaryCta: 'See use cases',
    navPrimaryCta: 'Book a workflow review',
    heroEyebrow: 'Practical AI systems',
    heroTitle: 'AI workflow automation for small businesses',
    heroLead: 'Turn operational chaos into a competitive advantage with practical AI workflow automation for lead handling, scheduling, follow-up, customer communication, and day-to-day operations.',
    heroNote: 'Built for practical business workflows - not AI hype.',
    heroPrimaryCta: 'Book a workflow review',
    heroSecondaryCta: 'See use cases',
    panelLabel: 'Deployment themes',
    panelBullet1: 'Repeatable workflows',
    panelBullet2: 'Fast implementation',
    panelBullet3: 'Human-reviewed deployment',
    panelBullet4: 'Ongoing optimization',
    stat1Title: 'Implementation and deployment',
    stat1Body: 'Configured around real processes, not demo scripts.',
    stat2Title: 'Existing tool integrations',
    stat2Body: 'Works with calendars, inboxes, CRMs, and operational tools already in use.',
    stat3Title: 'Monitored workflows',
    stat3Body: 'Boundaries, review points, and performance checks are built into rollout.',
    stat4Title: 'Business-first scope',
    stat4Body: 'Focused on response time, follow-up, scheduling, and smoother operations.',
    section1Kicker: 'What Operive does',
    section1Title: 'Practical AI systems built around repeatable business workflows',
    section1Body: 'We help small businesses implement AI automation where responsiveness, handoffs, and repetitive admin work are slowing growth.',
    card1Title: 'Lead intake and qualification',
    card1Body: 'Capture inquiries from forms, messages, and calls, route them properly, and create a cleaner first response process.',
    card2Title: 'Customer communication and follow-up',
    card2Body: 'Improve responsiveness with structured reply workflows, reminder systems, and follow-up sequences that do not get lost.',
    card3Title: 'Operations workflows and task automation',
    card3Body: 'Reduce manual admin work with triage, routing, summaries, and internal task handling connected to existing tools.',
    section2Kicker: 'Use cases',
    section2Title: 'Examples of the workflows small teams ask us to improve first',
    section2Cta: 'See all use cases',
    use1Title: 'Lead capture and instant response',
    use1Body: 'Turn new inbound interest into routed, documented follow-up instead of delayed manual triage.',
    use2Title: 'Scheduling and reminders',
    use2Body: 'Reduce scheduling friction with cleaner handoffs, confirmations, reminder flows, and calendar updates.',
    use3Title: 'Internal admin routing',
    use3Body: 'Move requests, messages, and operational tasks to the right person faster with less back-and-forth.',
    section3Kicker: 'How it works',
    section3Title: 'Operational rollout, not vague AI strategy',
    section3Cta: 'How it works',
    step1Title: 'Assess the workflow',
    step1Body: 'We identify where delays, dropped handoffs, or repetitive work are creating friction for the team.',
    step2Title: 'Configure the system',
    step2Body: 'We map rules, prompts, integrations, routing, and review steps around how the business already works.',
    step3Title: 'Launch and monitor',
    step3Body: 'We deploy with clear workflow boundaries and watch how the system performs in real operating conditions.',
    step4Title: 'Improve and expand',
    step4Body: 'Once one workflow is working well, we refine it and extend the same operating model into adjacent processes.',
    section4Kicker: 'Why Operive',
    section4Title: 'Built for businesses that want implementation, not experimentation for its own sake',
    why1Title: 'Practical workflow scope',
    why1Body: 'We focus on tasks that affect response time, scheduling, follow-up, customer communication, and operational throughput.',
    why2Title: 'Integrations with existing tools',
    why2Body: 'Deployment is designed to fit the systems a business already uses instead of forcing a full rebuild of operations.',
    why3Title: 'Monitored and optimized workflows',
    why3Body: 'We treat rollout as an operating system that should be reviewed, adjusted, and improved over time.',
    trustKicker: 'Trust and safety',
    trustTitle: 'Guardrails for real business usage',
    trust1: 'Human review where customer impact, approvals, or exceptions matter.',
    trust2: 'Workflow boundaries that define what the system can and cannot do.',
    trust3: 'Tool access controls based on role, need, and operational risk.',
    trust4: 'Documentation and staff guidance so workflows are understandable and usable.',
    trustCta: 'Read trust and safety',
    industryKicker: 'Industry examples',
    industryTitle: 'Best fit for small teams with recurring workflow pressure',
    industry1: 'Home services',
    industry2: 'Appointment-based businesses',
    industry3: 'Sales-driven SMBs',
    industry4: 'Operations-heavy small teams',
    industryCta: 'See industry examples',
    closingKicker: 'Start with one workflow',
    closingTitle: 'Find the workflow that is costing you the most',
    closingBody: 'If lead response is slow, follow-up is inconsistent, or admin work is draining the team, start there and build from a real business bottleneck.',
    closingPrimary: 'Book a workflow review',
    closingSecondary: 'Contact Operive',
  },
  ar: {
    navHome: 'الرئيسية',
    navServices: 'الخدمات',
    navHow: 'كيف نعمل',
    navUseCases: 'حالات الاستخدام',
    navIndustries: 'القطاعات',
    navTrust: 'الثقة والأمان',
    navAbout: 'من نحن',
    navContact: 'تواصل',
    selectorLabel: 'EN / AR',
    navSecondaryCta: 'شاهد الاستخدامات',
    navPrimaryCta: 'احجز مكالمة الآن',
    heroEyebrow: 'أنظمة ذكاء اصطناعي عملية',
    heroTitle: 'خلِّي شغلك أسرع… وخسارة الفرص أقل',
    heroLead: 'نركّب لك أنظمة ذكاء اصطناعي تخدم شغلك فعلاً. رد أسرع، متابعة أذكى، وحجوزات أسهل بدون تعقيد أو كلام نظري كثير.',
    heroNote: 'حلول عملية تركّز على النتيجة، وليس على الضجة.',
    heroPrimaryCta: 'احجز مكالمة الآن',
    heroSecondaryCta: 'شاهد الاستخدامات',
    panelLabel: 'لماذا هذا مفيد لك',
    panelBullet1: 'رد أسرع على العملاء',
    panelBullet2: 'تنفيذ سريع وواضح',
    panelBullet3: 'تحكم بشري عند الحاجة',
    panelBullet4: 'تحسين مستمر مع الوقت',
    stat1Title: 'تنفيذ على شغلك الحقيقي',
    stat1Body: 'نصمّم الحل على طريقتك الحالية، وليس على نموذج تجريبي جاهز.',
    stat2Title: 'يركب على أدواتك الحالية',
    stat2Body: 'يتكامل مع التقويم والبريد وCRM والأدوات التي يعمل بها فريقك اليوم.',
    stat3Title: 'متابعة وتحسين مستمر',
    stat3Body: 'نراقب الأداء ونعدّل حتى يبقى النظام مفيداً فعلاً.',
    stat4Title: 'تركيز مباشر على النمو',
    stat4Body: 'الأولوية دائماً لسرعة الرد، المتابعة، الحجز، وتقليل العمل اليدوي.',
    section1Kicker: 'ماذا نفعل',
    section1Title: 'ذكاء اصطناعي يخدم التشغيل ويزيد التحويل',
    section1Body: 'نساعد الشركات الصغيرة على تركيب أنظمة ذكية تقلل التأخير، ترفع جودة المتابعة، وتخفف الضغط اليومي على الفريق.',
    card1Title: 'التقاط العملاء وتأهيلهم',
    card1Body: 'نلتقط الطلبات من النماذج والرسائل والمكالمات، ثم نوجّهها بسرعة للطرف الصحيح.',
    card2Title: 'متابعة ورسائل أوضح',
    card2Body: 'ننظم الردود والتذكيرات والمتابعة حتى لا تضيع الفرص بين أفراد الفريق.',
    card3Title: 'تشغيل أقل فوضى',
    card3Body: 'نقلل الأعمال اليدوية المتكررة عبر أتمتة الفرز والتوجيه والملخصات والمهام.',
    section2Kicker: 'المشكلة والحل',
    section2Title: 'أين يضيع عليك النمو غالباً؟',
    section2Cta: 'شاهد كل الاستخدامات',
    use1Title: 'العميل يرسل… والرد يتأخر',
    use1Body: 'نحوّل الاهتمام الجديد إلى متابعة واضحة وسريعة بدل التأخير والارتباك.',
    use2Title: 'الحجز يضيع بين الرسائل',
    use2Body: 'نرتب التأكيدات والتذكيرات والتحويل إلى التقويم بشكل أسهل وأسرع.',
    use3Title: 'الفريق مشغول في أمور متكررة',
    use3Body: 'نخفف الأعمال الإدارية المتكررة حتى يركز الفريق على ما يجيب نتيجة.',
    section3Kicker: 'كيف نعمل',
    section3Title: 'طريقة بسيطة وواضحة من أول يوم',
    section3Cta: 'كيف نعمل',
    step1Title: 'نفهم نقطة التعطّل',
    step1Body: 'نحدد أين يبطؤ الرد، أين تضيع الفرص، وأين يستهلك الفريق وقته بدون داعٍ.',
    step2Title: 'نركّب الحل المناسب',
    step2Body: 'نبني القواعد والرسائل والتكاملات على طريقة شغلك الحالية، وليس العكس.',
    step3Title: 'نطلق ونتابع',
    step3Body: 'نبدأ بنطاق واضح ونراقب الأداء في الاستخدام الحقيقي، لا في العرض فقط.',
    step4Title: 'نحسّن ثم نوسّع',
    step4Body: 'عندما ينجح أول تدفق، نطوره ونوسع نفس المنهج إلى أجزاء أخرى من التشغيل.',
    section4Kicker: 'لماذا Operive',
    section4Title: 'لسنا عرضاً نظرياً عن الذكاء الاصطناعي',
    why1Title: 'نتعامل مع مشاكل واضحة',
    why1Body: 'نركز على الرد، المتابعة، الحجز، والتشغيل اليومي الذي يؤثر مباشرة على المبيعات.',
    why2Title: 'بدون قلب كامل للنظام',
    why2Body: 'نركّب الحل فوق أدواتك الحالية بدل أن نفرض تغييراً متعباً على الفريق.',
    why3Title: 'نتيجة قابلة للقياس',
    why3Body: 'نقيس التحسن في السرعة، التنظيم، والمتابعة حتى ترى الأثر بوضوح.',
    trustKicker: 'الثقة والأمان',
    trustTitle: 'أتمتة ذكية… مع حدود واضحة',
    trust1: 'يوجد تدخل بشري عندما تؤثر المهمة على العميل أو القرار النهائي.',
    trust2: 'نحدد بوضوح ما الذي يفعله النظام وما الذي لا يجب أن يفعله.',
    trust3: 'الصلاحيات تُضبط حسب الدور والحاجة ومستوى المخاطرة.',
    trust4: 'كل شيء موثّق بحيث يبقى الاستخدام واضحاً وسهل الفهم للفريق.',
    trustCta: 'اقرأ عن الثقة والأمان',
    industryKicker: 'أفضل القطاعات',
    industryTitle: 'مناسب للشركات التي تعاني من ضغط تشغيلي يومي',
    industry1: 'الخدمات المنزلية',
    industry2: 'الأعمال المعتمدة على المواعيد',
    industry3: 'الفرق الصغيرة المعتمدة على المبيعات',
    industry4: 'الفرق التي يستهلكها العمل الإداري',
    industryCta: 'شاهد أمثلة القطاعات',
    closingKicker: 'ابدأ من أكثر نقطة تؤلمك',
    closingTitle: 'إذا كان التأخير يكلّفك فرصاً… فهذا هو أول مكان نبدأ منه',
    closingBody: 'نراجع معك أين تضيع الفرص، ثم نبني أول تدفق ذكي يعطيك نتيجة واضحة بسرعة.',
    closingPrimary: 'احجز مكالمة الآن',
    closingSecondary: 'تواصل مع Operive',
  },
};

const normalizeLocale = (value) => {
  if (!value) return '';
  const lower = String(value).toLowerCase();
  if (lower.startsWith('ar')) return 'ar';
  if (lower.startsWith('en')) return 'en';
  return '';
};

const detectPreferredLocale = () => {
  const saved = normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
  if (saved) return saved;

  const params = new URLSearchParams(window.location.search);
  const queryLocale = normalizeLocale(params.get('lang'));
  if (queryLocale) return queryLocale;

  const htmlCountry = document.documentElement.dataset.country || '';
  const htmlLocaleHint = normalizeLocale(document.documentElement.dataset.localeHint || '');
  if (htmlLocaleHint) return htmlLocaleHint;

  const countryLocale = localeManifest.countryLocaleMap[String(htmlCountry).toUpperCase()] || '';
  if (countryLocale) return countryLocale;

  const browserLocales = Array.isArray(navigator.languages) ? navigator.languages : [navigator.language];
  for (const locale of browserLocales) {
    const normalized = normalizeLocale(locale);
    if (normalized) return normalized;
  }

  return localeManifest.defaultLocale;
};

const applyHomepageCopy = (locale) => {
  const strings = homeTranslations[locale] || homeTranslations.en;
  document.querySelectorAll('[data-copy]').forEach((node) => {
    const key = node.dataset.copy;
    if (strings[key]) node.textContent = strings[key];
  });
};

const applyLocale = (locale) => {
  const normalized = normalizeLocale(locale) || localeManifest.defaultLocale;
  const direction = localeManifest.rtlLocales.includes(normalized) ? 'rtl' : 'ltr';

  document.documentElement.lang = normalized;
  document.documentElement.dir = direction;
  document.documentElement.dataset.activeLocale = normalized;
  document.body.dataset.locale = normalized;
  document.body.dataset.direction = direction;

  applyHomepageCopy(normalized);
};

const initLocaleControls = () => {
  const preferredLocale = detectPreferredLocale();
  applyLocale(preferredLocale);

  document.querySelectorAll('[data-locale-switcher]').forEach((select) => {
    select.innerHTML = '';
    localeManifest.supportedLocales.forEach((locale) => {
      const option = document.createElement('option');
      option.value = locale;
      option.textContent = localeManifest.localeLabels[locale] || locale;
      if (locale === preferredLocale) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener('change', (event) => {
      const nextLocale = normalizeLocale(event.target.value) || localeManifest.defaultLocale;
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      applyLocale(nextLocale);
    });
  });
};

initLocaleControls();

const leadCaptureForm = document.querySelector('#lead-capture-form');

if (leadCaptureForm) {
  const webhookUrl = leadCaptureForm.dataset.webhookUrl || '';
  const bookingUrl = leadCaptureForm.dataset.bookingUrl || '';
  const params = new URLSearchParams(window.location.search);
  const setValue = (name, value) => {
    const field = leadCaptureForm.querySelector(`[name="${name}"]`);
    if (field) field.value = value;
  };

  const button = leadCaptureForm.querySelector('button[type="submit"]');
  const nextField = leadCaptureForm.querySelector('[name="_next"]');
  const bookingTimelines = new Set(['ASAP', 'This month']);
  const wantsBooking = (formData) => {
    const nextStep = formData.get('best-next-step');
    const timeline = formData.get('timeline');

    return nextStep === 'I want to book a call' || bookingTimelines.has(String(timeline));
  };

  const buildPayload = (formData, bookingRequested) => ({
    name: formData.get('name') || '',
    email: formData.get('work-email') || '',
    goal: formData.get('problem-or-use-case') || '',
    company: formData.get('company') || '',
    phone: formData.get('phone') || '',
    website: formData.get('website') || '',
    inquiryType: formData.get('inquiry-type') || '',
    monthlyLeadVolume: formData.get('monthly-lead-volume') || '',
    biggestBottleneck: formData.get('biggest-bottleneck') || '',
    timeline: formData.get('timeline') || '',
    bestNextStep: formData.get('best-next-step') || '',
    preferredContactMethod: formData.get('preferred-contact-method') || '',
    landingPage: formData.get('landing-page') || '',
    referrer: formData.get('referrer') || '',
    utmSource: formData.get('utm-source') || '',
    utmMedium: formData.get('utm-medium') || '',
    utmCampaign: formData.get('utm-campaign') || '',
    source: 'operive-contact-form',
    bookingRequested,
  });

  const buildBookingRedirect = (payload) => {
    if (!bookingUrl) return '';

    const redirectUrl = new URL(bookingUrl);
    if (payload.name) redirectUrl.searchParams.set('name', payload.name);
    if (payload.email) redirectUrl.searchParams.set('email', payload.email);
    if (payload.goal) redirectUrl.searchParams.set('a1', payload.goal);
    return redirectUrl.toString();
  };

  const disableButton = () => {
    if (!button) return;
    button.disabled = true;
    button.textContent = 'Sending…';
  };

  const enableButton = () => {
    if (!button) return;
    button.disabled = false;
    button.textContent = 'Request workflow review';
  };

  const submitWebhook = async (payload) => {
    if (!webhookUrl) return false;

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  };

  setValue('landing-page', window.location.href);
  setValue('referrer', document.referrer || 'direct');
  setValue('utm-source', params.get('utm_source') || '');
  setValue('utm-medium', params.get('utm_medium') || '');
  setValue('utm-campaign', params.get('utm_campaign') || '');

  leadCaptureForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    disableButton();

    const formData = new FormData(leadCaptureForm);
    const bookingRequested = wantsBooking(formData);
    const payload = buildPayload(formData, bookingRequested);
    const bookingRedirect = buildBookingRedirect(payload);
    const fallbackRedirect = bookingRequested && bookingRedirect
      ? bookingRedirect
      : 'https://www.operive.com/thanks.html';

    if (nextField) {
      nextField.value = fallbackRedirect;
    }

    const webhookDelivered = await submitWebhook(payload);

    if (webhookDelivered) {
      window.location.href = fallbackRedirect;
      return;
    }

    enableButton();
    HTMLFormElement.prototype.submit.call(leadCaptureForm);
  });
}
