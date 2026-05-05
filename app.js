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
    faqKicker: 'FAQ',
    faqTitle: 'Common questions',
    faq1Question: 'What kind of businesses is Operive built for?',
    faq1Answer: 'Small businesses and lean teams that need better lead handling, customer communication, scheduling, follow-up, and operations support.',
    faq2Question: 'Do you replace staff?',
    faq2Answer: 'No. The goal is to reduce manual bottlenecks, improve responsiveness, and support teams with clearer workflows.',
    faq3Question: 'Do you only work with one industry?',
    faq3Answer: 'No. We work best where recurring workflows, intake volume, scheduling, and follow-up are important, across several small-business categories.',
    faq4Question: 'How do engagements usually start?',
    faq4Answer: 'Usually with one workflow that clearly matters, then a deployment plan, implementation, monitoring, and refinement.',
    closingKicker: 'Start with one workflow',
    closingTitle: 'Find the workflow that is costing you the most',
    closingBody: 'If lead response is slow, follow-up is inconsistent, or admin work is draining the team, start there and build from a real business bottleneck.',
    closingPrimary: 'Book a workflow review',
    closingSecondary: 'Contact Operive',
    footerLine: 'Save time. Win more customers. Grow more intelligently.',
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
    navSecondaryCta: 'تعرّف أكثر',
    navPrimaryCta: 'احجز مكالمة',
    heroEyebrow: 'حلول عملية يتم تركيبها لك بالكامل',
    heroTitle: 'أنظمة ذكاء اصطناعي توفّر وقتك وتزيد عملاءك',
    heroLead: 'نساعد الشركات على أتمتة خدمة العملاء، التقاط العملاء المحتملين، وإدارة المتابعة — بدون تعقيد.',
    heroNote: 'حلول عملية يتم تركيبها لك بالكامل',
    heroPrimaryCta: 'احجز مكالمة',
    heroSecondaryCta: 'تعرّف أكثر',
    panelLabel: 'كيف نساعدك',
    panelBullet1: 'أتمتة خدمة العملاء',
    panelBullet2: 'التقاط العملاء المحتملين',
    panelBullet3: 'متابعة تلقائية',
    panelBullet4: 'تنظيم المواعيد',
    stat1Title: 'أتمتة خدمة العملاء',
    stat1Body: 'ردود فورية على استفسارات العملاء عبر واتساب وتليجرام والبريد.',
    stat2Title: 'التقاط العملاء المحتملين',
    stat2Body: 'تحويل الزوار إلى فرص حقيقية بدون فقدان أي عميل.',
    stat3Title: 'متابعة تلقائية',
    stat3Body: 'نظام متابعة ذكي يزيد فرص الإغلاق بدون جهد يدوي.',
    stat4Title: 'تنظيم المواعيد',
    stat4Body: 'حجوزات تلقائية وتقليل التأخير في الرد.',
    section1Kicker: 'كيف نساعدك',
    section1Title: 'أنظمة ذكية تخفف الضغط وتسرّع النمو',
    section1Body: 'نساعد الشركات على بناء أنظمة واضحة تخدم العملاء أسرع وتخفف العبء اليومي على الفريق.',
    card1Title: 'أتمتة خدمة العملاء',
    card1Body: 'ردود أسرع وتجربة أفضل للعملاء بدون الحاجة للرد اليدوي على كل استفسار.',
    card2Title: 'التقاط العملاء المحتملين',
    card2Body: 'كل زائر أو استفسار يتحول إلى فرصة واضحة بدل أن يضيع بين القنوات.',
    card3Title: 'متابعة تلقائية',
    card3Body: 'متابعة مستمرة وذكية تزيد احتمالية الإغلاق وتقلل الاعتماد على التذكير اليدوي.',
    section2Kicker: 'مشاكل شائعة نحلها',
    section2Title: 'مشاكل شائعة نحلها',
    section2Cta: 'تعرّف أكثر',
    use1Title: 'تأخر الرد على العملاء',
    use1Body: 'نسرّع الرد من أول تواصل حتى لا يبرد اهتمام العميل.',
    use2Title: 'فقدان فرص بسبب عدم المتابعة',
    use2Body: 'نبني متابعة تلقائية تحفظ الفرص وتزيد التحويل.',
    use3Title: 'ضغط العمليات اليومية',
    use3Body: 'نخفف التكرار والعمل اليدوي حتى يركز الفريق على الأهم.',
    section3Kicker: 'كيف يعمل النظام',
    section3Title: 'كيف يعمل النظام',
    section3Cta: 'كيف نعمل',
    step1Title: 'نفهم احتياجات عملك',
    step1Body: 'نبدأ بفهم ما يبطئك وما الذي يحتاج إلى أتمتة فعلاً.',
    step2Title: 'نصمّم النظام المناسب',
    step2Body: 'نحدد التدفق والرسائل والأدوات التي تناسب طريقة عملك.',
    step3Title: 'نقوم بتركيبه بالكامل',
    step3Body: 'ننفذ كل شيء لك بشكل عملي وواضح.',
    step4Title: 'يبدأ بالعمل وتحقيق نتائج',
    step4Body: 'تشاهد الأثر مباشرة في السرعة والتنظيم والمتابعة.',
    section4Kicker: 'لماذا Operive؟',
    section4Title: 'لماذا Operive؟',
    why1Title: 'حلول عملية وليست نظرية',
    why1Body: 'نركّز على ما يفيد عملك الآن، لا على عروض نظرية طويلة.',
    why2Title: 'يتم التنفيذ لك بالكامل',
    why2Body: 'لا نتركك مع خطة فقط. نقوم بالتركيب والتنفيذ من البداية للنهاية.',
    why3Title: 'تركيز على النتائج الفعلية',
    why3Body: 'الهدف هو وقت أقل ضائع، رد أسرع، وعملاء أكثر.',
    trustKicker: 'الثقة والأمان',
    trustTitle: 'أتمتة ذكية… مع حدود واضحة',
    trust1: 'يوجد تدخل بشري عندما تؤثر المهمة على العميل أو القرار النهائي.',
    trust2: 'نحدد بوضوح ما الذي يفعله النظام وما الذي لا يجب أن يفعله.',
    trust3: 'الصلاحيات تُضبط حسب الدور والحاجة ومستوى المخاطرة.',
    trust4: 'كل شيء موثّق بحيث يبقى الاستخدام واضحاً وسهل الفهم للفريق.',
    trustCta: 'اقرأ عن الثقة والأمان',
    industryKicker: 'الحل',
    industryTitle: 'نحوّل هذه العمليات إلى أنظمة تعمل تلقائيًا لصالحك',
    industry1: 'تقليل الضغط اليومي',
    industry2: 'تسريع الرد',
    industry3: 'رفع التحويل',
    industry4: 'تقليل العمل اليدوي',
    industryCta: 'تعرّف أكثر',
    faqKicker: 'الأسئلة الشائعة',
    faqTitle: 'أسئلة شائعة قبل البدء',
    faq1Question: 'ما نوع الشركات التي تناسبها Operive؟',
    faq1Answer: 'نناسب الشركات الصغيرة والفرق المرنة التي تحتاج إلى تحسين استقبال العملاء، التواصل، الحجز، المتابعة، ودعم التشغيل اليومي.',
    faq2Question: 'هل تستبدلون الموظفين؟',
    faq2Answer: 'لا. الهدف هو تقليل الاختناقات اليدوية، تسريع الاستجابة، ودعم الفريق بسير عمل أوضح.',
    faq3Question: 'هل تعملون مع قطاع واحد فقط؟',
    faq3Answer: 'لا. ننجح أكثر مع الأنشطة التي تعتمد على تدفقات متكررة، حجم طلبات مستمر، مواعيد، ومتابعة عبر عدة قطاعات مختلفة.',
    faq4Question: 'كيف تبدأ المشاريع عادةً؟',
    faq4Answer: 'غالباً نبدأ بتدفق واحد مهم بوضوح، ثم نضع خطة تنفيذ، نطلقه، نراقب الأداء، وبعدها نحسّن ونوسّع.',
    closingKicker: 'جاهز لتوفير وقتك وزيادة عملائك؟',
    closingTitle: 'جاهز لتوفير وقتك وزيادة عملائك؟',
    closingBody: 'دعنا نريك كيف يمكن تطبيق هذا على عملك',
    closingPrimary: 'احجز مكالمة الآن',
    closingSecondary: 'تعرّف أكثر',
    footerLine: 'وفّر وقتك. زِد عملاءك. نمِّ أعمالك بذكاء.',
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
