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
    ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
    FR: 'fr', BE: 'fr', CA: 'fr',
    DE: 'de', AT: 'de', CH: 'de',
    BR: 'pt-BR', PT: 'pt-BR',
  },
};

const normalizeLocale = (value) => {
  if (!value) return '';
  const lower = String(value).toLowerCase();
  if (lower.startsWith('pt-br')) return 'pt-BR';
  if (lower.startsWith('ar')) return 'ar';
  if (lower.startsWith('es')) return 'es';
  if (lower.startsWith('fr')) return 'fr';
  if (lower.startsWith('de')) return 'de';
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

const applyLocale = (locale) => {
  const normalized = normalizeLocale(locale) || localeManifest.defaultLocale;
  const direction = localeManifest.rtlLocales.includes(normalized) ? 'rtl' : 'ltr';

  document.documentElement.lang = normalized;
  document.documentElement.dir = direction;
  document.body.dataset.locale = normalized;
  document.body.dataset.direction = direction;
  document.documentElement.dataset.activeLocale = normalized;

  document.querySelectorAll('[data-locale-label]').forEach((node) => {
    node.textContent = localeManifest.localeLabels[normalized] || localeManifest.localeLabels.en;
  });
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
