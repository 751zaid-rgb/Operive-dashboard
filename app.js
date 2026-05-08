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
    navSecondaryCta: 'See examples',
    navPrimaryCta: 'Book a workflow review',
    heroEyebrow: 'Practical AI for service teams',
    heroTitle: 'AI workflows that save time and capture more leads',
    heroLead: 'Operive helps small businesses automate lead response, scheduling, follow-up, and customer communication with systems built for real operations.',
    heroNote: 'Built for real operations — not AI theater.',
    heroPrimaryCta: 'Book a workflow review',
    heroSecondaryCta: 'See examples',
    panelLabel: 'What you can improve',
    panelBullet1: 'Lead response',
    panelBullet2: 'Booking flow',
    panelBullet3: 'Human-reviewed launch',
    panelBullet4: 'Ongoing optimization',
    stat1Title: 'Fast implementation',
    stat1Body: 'Set up around real workflows, not demo scripts.',
    stat2Title: 'Works with your tools',
    stat2Body: 'Calendars, inboxes, CRMs, and operational tools stay part of the flow.',
    stat3Title: 'Clear guardrails',
    stat3Body: 'Review points, handoffs, and boundaries are built in from the start.',
    stat4Title: 'Focused on outcomes',
    stat4Body: 'Designed to improve response time, follow-up, booking, and daily operations.',
    section1Kicker: 'What Operive does',
    section1Title: 'Practical AI systems for the workflows that matter most',
    section1Body: 'We help small businesses fix the operational bottlenecks that slow response time, weaken follow-up, and create unnecessary admin work.',
    card1Title: 'Lead intake and qualification',
    card1Body: 'Capture inquiries from forms, messages, and calls, route them correctly, and start follow-up faster.',
    card2Title: 'Customer communication and follow-up',
    card2Body: 'Keep replies, reminders, and next steps consistent so good leads do not go cold.',
    card3Title: 'Operations and admin automation',
    card3Body: 'Reduce repetitive work with triage, routing, summaries, and internal task handling tied to existing tools.',
    section2Kicker: 'Use cases',
    section2Title: 'Examples of the workflows teams usually fix first',
    section2Cta: 'See all examples',
    use1Title: 'Lead capture and instant response',
    use1Body: 'Turn new inbound interest into routed, documented follow-up instead of delayed manual triage.',
    use2Title: 'Scheduling and reminders',
    use2Body: 'Reduce scheduling friction with cleaner handoffs, confirmations, reminder flows, and calendar updates.',
    use3Title: 'Internal admin routing',
    use3Body: 'Move requests, messages, and operational tasks to the right person faster with less back-and-forth.',
    section3Kicker: 'How it works',
    section3Title: 'A clear rollout, not vague AI strategy',
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
    section4Title: 'Built for businesses that want implementation, not AI for its own sake',
    why1Title: 'Practical workflow scope',
    why1Body: 'We focus on tasks that affect response time, scheduling, follow-up, customer communication, and operational throughput.',
    why2Title: 'Integrations with existing tools',
    why2Body: 'Deployment is designed to fit the systems a business already uses instead of forcing a full rebuild of operations.',
    why3Title: 'Monitored and optimized workflows',
    why3Body: 'We treat rollout as an operating system that should be reviewed, adjusted, and improved over time.',
    trustKicker: 'Trust and safety',
    trustTitle: 'Guardrails for real business use',
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
    faqTitle: 'Questions people usually ask first',
    faq1Question: 'What kind of businesses is Operive built for?',
    faq1Answer: 'Small businesses and lean teams that need better lead handling, customer communication, scheduling, follow-up, and operations support.',
    faq2Question: 'Do you replace staff?',
    faq2Answer: 'No. The goal is to reduce manual bottlenecks, improve responsiveness, and support teams with clearer workflows.',
    faq3Question: 'Do you only work with one industry?',
    faq3Answer: 'No. We work best where recurring workflows, intake volume, scheduling, and follow-up are important, across several small-business categories.',
    faq4Question: 'How do engagements usually start?',
    faq4Answer: 'Usually with one workflow that clearly matters, then a deployment plan, implementation, monitoring, and refinement.',
    reviewKicker: 'Workflow review',
    reviewTitle: 'What you get from the first conversation',
    reviewBody: 'The goal is to identify the workflow worth fixing first, the risk points to watch, and whether there is a practical next step.',
    reviewCard1Title: 'A clear bottleneck diagnosis',
    reviewCard1Body: 'We map where leads, bookings, handoffs, or admin tasks are slowing the business down right now.',
    reviewCard2Title: 'The best first automation candidate',
    reviewCard2Body: 'You leave knowing which workflow is most likely to produce a fast, measurable operational win first.',
    reviewCard3Title: 'A realistic next-step plan',
    reviewCard3Body: 'If there is a fit, we outline scope, review needs, and what implementation would look like without overcommitting.',
    closingKicker: 'Start with one workflow',
    closingTitle: 'Start with the workflow costing you the most time',
    closingBody: 'If lead response is slow, follow-up is inconsistent, or admin work is draining the team, that is the right place to start.',
    closingPrimary: 'Book a workflow review',
    closingSecondary: 'Contact Operive',
    footerLine: 'Save time. Respond faster. Grow with better systems.',
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
    navSecondaryCta: 'شاهد الأمثلة',
    navPrimaryCta: 'احجز مراجعة',
    heroEyebrow: 'حلول ذكاء اصطناعي عملية لفرق الخدمات',
    heroTitle: 'أنظمة ذكاء اصطناعي توفّر الوقت وتزيد الفرص',
    heroLead: 'نساعد الشركات الصغيرة على تحسين سرعة الرد، المتابعة، والحجز عبر أنظمة عملية تُبنى حول طريقة عملك.',
    heroNote: 'تنفيذ عملي، لا وعود مبالغ فيها.',
    heroPrimaryCta: 'احجز مراجعة',
    heroSecondaryCta: 'شاهد الأمثلة',
    panelLabel: 'ما الذي يمكن تحسينه',
    panelBullet1: 'سرعة الرد على العملاء',
    panelBullet2: 'تنظيم الحجز',
    panelBullet3: 'إطلاق مع مراجعة بشرية',
    panelBullet4: 'تحسين مستمر',
    stat1Title: 'تنفيذ سريع',
    stat1Body: 'نركّب النظام حول سير العمل الحقيقي، لا حول عرض تجريبي.',
    stat2Title: 'يعمل مع أدواتك الحالية',
    stat2Body: 'البريد، التقويم، أنظمة العملاء، وأدوات التشغيل تبقى جزءاً من النظام.',
    stat3Title: 'حدود واضحة',
    stat3Body: 'نقاط المراجعة والتحويلات والضوابط تكون واضحة من البداية.',
    stat4Title: 'تركيز على النتيجة',
    stat4Body: 'الهدف هو رد أسرع، متابعة أفضل، وحجوزات أكثر سلاسة.',
    section1Kicker: 'كيف نساعدك',
    section1Title: 'أنظمة عملية لسير العمل الذي يؤثر على النمو فعلاً',
    section1Body: 'نساعد الشركات الصغيرة على معالجة نقاط الاختناق التي تبطئ الرد، تضعف المتابعة، وتستهلك وقت الفريق يومياً.',
    card1Title: 'استقبال العملاء وتأهيلهم',
    card1Body: 'نجمع الطلبات من النماذج والرسائل والمكالمات، نوجّهها بشكل صحيح، ونبدأ المتابعة بسرعة أكبر.',
    card2Title: 'التواصل مع العملاء والمتابعة',
    card2Body: 'نجعل الردود والتذكيرات والخطوات التالية أكثر اتساقاً حتى لا تبرد الفرص الجيدة.',
    card3Title: 'أتمتة التشغيل والأعمال الإدارية',
    card3Body: 'نخفف الأعمال المتكررة عبر الفرز والتوجيه والملخصات والمهام الداخلية المرتبطة بأدواتك الحالية.',
    section2Kicker: 'مشاكل شائعة نحلها',
    section2Title: 'أمثلة على أولى العمليات التي نبدأ بتحسينها',
    section2Cta: 'شاهد كل الأمثلة',
    use1Title: 'تأخر الرد على العملاء',
    use1Body: 'نسرّع الرد من أول تواصل حتى لا يبرد اهتمام العميل.',
    use2Title: 'فقدان فرص بسبب عدم المتابعة',
    use2Body: 'نبني متابعة تلقائية تحفظ الفرص وتزيد التحويل.',
    use3Title: 'ضغط العمليات اليومية',
    use3Body: 'نخفف التكرار والعمل اليدوي حتى يركز الفريق على الأهم.',
    section3Kicker: 'كيف يعمل النظام',
    section3Title: 'خطوات واضحة، لا كلام عام عن الذكاء الاصطناعي',
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
    section4Title: 'مناسب للشركات التي تريد تنفيذاً عملياً، لا تجربة لمجرد التجربة',
    why1Title: 'حلول عملية وليست نظرية',
    why1Body: 'نركّز على ما يفيد عملك الآن، لا على عروض نظرية طويلة.',
    why2Title: 'يتم التنفيذ لك بالكامل',
    why2Body: 'لا نتركك مع خطة فقط. نقوم بالتركيب والتنفيذ من البداية للنهاية.',
    why3Title: 'تركيز على النتائج الفعلية',
    why3Body: 'الهدف هو وقت أقل ضائع، رد أسرع، وعملاء أكثر.',
    trustKicker: 'الثقة والأمان',
    trustTitle: 'أتمتة عملية ضمن حدود واضحة',
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
    faqTitle: 'أسئلة يطرحها العملاء عادةً في البداية',
    faq1Question: 'ما نوع الشركات التي تناسبها Operive؟',
    faq1Answer: 'نناسب الشركات الصغيرة والفرق المرنة التي تحتاج إلى تحسين استقبال العملاء، التواصل، الحجز، المتابعة، ودعم التشغيل اليومي.',
    faq2Question: 'هل تستبدلون الموظفين؟',
    faq2Answer: 'لا. الهدف هو تقليل الاختناقات اليدوية، تسريع الاستجابة، ودعم الفريق بسير عمل أوضح.',
    faq3Question: 'هل تعملون مع قطاع واحد فقط؟',
    faq3Answer: 'لا. ننجح أكثر مع الأنشطة التي تعتمد على تدفقات متكررة، حجم طلبات مستمر، مواعيد، ومتابعة عبر عدة قطاعات مختلفة.',
    faq4Question: 'كيف تبدأ المشاريع عادةً؟',
    faq4Answer: 'غالباً نبدأ بتدفق واحد مهم بوضوح، ثم نضع خطة تنفيذ، نطلقه، نراقب الأداء، وبعدها نحسّن ونوسّع.',
    reviewKicker: 'مراجعة سير العمل',
    reviewTitle: 'ماذا ستحصل عليه من أول مكالمة',
    reviewBody: 'الهدف هو تحديد سير العمل الذي يستحق الإصلاح أولاً، ونقاط المخاطرة التي يجب الانتباه لها، وهل توجد خطوة عملية مناسبة بعد ذلك.',
    reviewCard1Title: 'تشخيص واضح للاختناق',
    reviewCard1Body: 'نحدّد أين تتباطأ الاستفسارات أو الحجوزات أو التحويلات الداخلية أو الأعمال الإدارية داخل النشاط الآن.',
    reviewCard2Title: 'أفضل فرصة أولى للأتمتة',
    reviewCard2Body: 'تخرج وأنت تعرف أي سير عمل هو الأرجح أن يحقق مكسباً تشغيلياً سريعاً وملموساً أولاً.',
    reviewCard3Title: 'خطة واقعية للخطوة التالية',
    reviewCard3Body: 'إذا كان هناك توافق، نوضّح النطاق واحتياجات المراجعة وما قد يبدو عليه التنفيذ بدون وعود مبالغ فيها.',
    closingKicker: 'ابدأ بسير العمل الأهم',
    closingTitle: 'ابدأ بالعملية التي تستهلك أكبر قدر من وقت فريقك',
    closingBody: 'إذا كان الرد بطيئاً أو المتابعة غير مستقرة أو الأعمال الإدارية ترهق الفريق، فهذه أفضل نقطة للبدء.',
    closingPrimary: 'احجز مراجعة',
    closingSecondary: 'تواصل معنا',
    footerLine: 'وفّر وقتك. استجب أسرع. ووسّع عملك بأنظمة أفضل.',
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
  const defaultButtonText = button ? button.textContent : '';
  const nextField = leadCaptureForm.querySelector('[name="_next"]');
  const statusNode = document.querySelector('#form-status');
  const bookingTimelines = new Set(['ASAP', 'This month']);
  const wantsBooking = (formData) => {
    const nextStep = formData.get('best-next-step');
    const timeline = formData.get('timeline');

    return nextStep === 'I want to book a call' || bookingTimelines.has(String(timeline));
  };

  const setStatus = (message = '', state = '') => {
    if (!statusNode) return;
    statusNode.textContent = message;
    if (state) {
      statusNode.dataset.state = state;
    } else {
      delete statusNode.dataset.state;
    }
  };

  const getFieldLabel = (field) => {
    const label = field.closest('label');
    if (!label) return 'This field';

    return Array.from(label.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent.replace(/\s+/g, ' ').trim())
      .find(Boolean) || 'This field';
  };

  const getErrorNode = (field) => {
    const label = field.closest('label');
    if (!label || !field.name) return null;

    const errorId = `${field.name}-error`;
    let errorNode = label.querySelector(`#${CSS.escape(errorId)}`);

    if (!errorNode) {
      errorNode = document.createElement('p');
      errorNode.className = 'form-error';
      errorNode.id = errorId;
      label.appendChild(errorNode);
    }

    const describedBy = new Set((field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    describedBy.add(errorId);
    field.setAttribute('aria-describedby', Array.from(describedBy).join(' '));

    return errorNode;
  };

  const clearFieldError = (field) => {
    field.removeAttribute('aria-invalid');
    const errorNode = getErrorNode(field);
    if (errorNode) errorNode.textContent = '';
  };

  const validateField = (field) => {
    const value = typeof field.value === 'string' ? field.value.trim() : field.value;
    const label = getFieldLabel(field);
    let message = '';

    if (field.required && !value) {
      message = `${label} is required.`;
    } else if (field.type === 'email' && value && !field.validity.valid) {
      message = 'Enter a valid email address.';
    } else if (field.type === 'url' && value && !field.validity.valid) {
      message = 'Enter a valid website URL, including https://';
    }

    const errorNode = getErrorNode(field);
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      if (errorNode) errorNode.textContent = message;
      return message;
    }

    clearFieldError(field);
    return '';
  };

  const validateForm = () => {
    const fields = Array.from(leadCaptureForm.querySelectorAll('input, select, textarea'))
      .filter((field) => field.type !== 'hidden' && field.type !== 'submit');

    const invalidFields = fields.filter((field) => Boolean(validateField(field)));
    return invalidFields;
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
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Sending…';
  };

  const enableButton = () => {
    if (!button) return;
    button.disabled = false;
    button.removeAttribute('aria-busy');
    button.textContent = defaultButtonText || 'Request workflow review';
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

  leadCaptureForm.querySelectorAll('input, select, textarea').forEach((field) => {
    if (field.type === 'hidden' || field.type === 'submit') return;

    const validateCurrentField = () => {
      validateField(field);
      if (!leadCaptureForm.querySelector('[aria-invalid="true"]')) {
        setStatus('');
      }
    };

    field.addEventListener('blur', validateCurrentField);
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateCurrentField();
    });
    field.addEventListener('change', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateCurrentField();
    });
  });

  leadCaptureForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const invalidFields = validateForm();
    if (invalidFields.length) {
      setStatus(`Please review ${invalidFields.length === 1 ? 'the highlighted field' : `the ${invalidFields.length} highlighted fields`} and try again.`, 'error');
      invalidFields[0].focus();
      return;
    }

    disableButton();
    setStatus('Sending your request…', 'progress');

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
      setStatus('Thanks — sending you to the next step…', 'progress');
      window.location.href = fallbackRedirect;
      return;
    }

    setStatus('Secure handoff failed, so we are sending your request through the backup form now.', 'progress');
    enableButton();
    HTMLFormElement.prototype.submit.call(leadCaptureForm);
  });
}
