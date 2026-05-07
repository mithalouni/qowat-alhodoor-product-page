import React from 'react';
import { createRoot } from 'react-dom/client';
import { init as initPlausible, track as trackPlausible } from '@plausible-analytics/tracker';
import './styles.css';

function initAnalytics() {
  if (window.__plausibleInitialized) return;
  window.__plausibleInitialized = true;

  initPlausible({
    domain: 'leish.shop',
    hashBasedRouting: true,
    logging: false,
  });
}

initAnalytics();

const trackedOnceEvents = new Set();

function trackEvent(eventName) {
  try {
    trackPlausible(eventName, {});
  } catch {
  }
}

function trackEventOnce(eventName) {
  if (trackedOnceEvents.has(eventName)) return;
  trackedOnceEvents.add(eventName);
  trackEvent(eventName);
}

function trackBuyClick(location) {
  trackEvent('Buy CTA Clicked');
  trackEvent(`Buy CTA Clicked - ${location}`);
}

const desires = [
  ['تريد أن تُسمع', 'عندك أفكار، لكنك تريد طريقة تجعل كلامك يصل بوضوح ووزن.'],
  ['تريد أن تُحترم', 'لا تريد أن تكون الشخص السهل الذي تُؤخذ طيبته كأمر مضمون.'],
  ['تريد أن تؤثر', 'تريد فهم النفوذ، الإقناع، وقراءة الناس من غير تلاعب رخيص.'],
  ['تريد علاقات أنجح', 'تريد جاذبية طبيعية، قربًا مريحًا، واحترامًا لا يكسرك ولا يبعد الناس عنك.'],
];

const path = [
  ['01', 'ثقة لا تهتز', 'القوة الداخلية، الذكاء العاطفي، الثقة الثابتة، والتخلص من تأجيل حياتك.', '/charisma-web-images/confidence-godlike-no-eyes.webp'],
  ['02', 'هيبة وكلام يُسمع', 'الكاريزما، الكلام المؤثر، قراءة الناس، والحدود التي تصنع الاحترام.', '/charisma-web-images/enter-room-power.webp'],
  ['03', 'قوة التأثير وكشف التلاعب', 'القيادة، النفوذ الخفي، كشف التلاعب، وحماية نفسك من الاستغلال.', '/charisma-web-images/leadership-power.webp'],
  ['04', 'جاذبية وعلاقات ناجحة', 'تغيير صورتك أمام الناس، الصداقة، الجاذبية، وتثبيت نسختك الجديدة.', '/charisma-web-images/relationships-power.webp'],
];

const toc = [
  'كيف تبني قوتك من الداخل',
  'كيف تفهم مشاعرك وتضبطها',
  'كيف تقوّي ثقتك بنفسك',
  'كيف تتوقف عن تأجيل حياتك',
  'كيف تصنع كاريزما حقيقية',
  'كيف تتكلم بطريقة تؤثر',
  'كيف تقرأ الناس بذكاء',
  'كيف تجعل الناس يحترمونك',
  'كيف تقود قبل أن تملك منصبًا',
  'كيف تفهم النفوذ الخفي',
  'كيف تكتشف التلاعب النفسي',
  'كيف تحمي نفسك من الاستغلال',
  'كيف تغيّر صورتك أمام الناس',
  'كيف تصنع أصدقاء بسهولة',
  'كيف تكون أكثر جاذبية في العلاقات',
  'كيف تثبّت التغيير ولا تعود للقديم',
];

const outcomes = [
  'ثقة أهدأ أمام الناس.',
  'كلام أوضح وأكثر تأثيرًا.',
  'احترام أكبر من غير قسوة.',
  'فهم أعمق للنفس والآخرين.',
  'جاذبية اجتماعية من غير تصنّع.',
];

const DEFAULT_PRODUCT_CONFIG = {
  productName: 'كاريزما جذابة',
  amount: 3999,
  currency: 'sar',
  currencyCode: 'SAR',
  priceLabel: '39.99 ريال',
};

let checkoutBootstrapPromise;

function apiPath(path) {
  const currentParams = new URLSearchParams(window.location.search);
  const params = new URLSearchParams();
  ['country', 'currency'].forEach((key) => {
    if (currentParams.get(key)) params.set(key, currentParams.get(key));
  });

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

async function readApiJson(response, fallbackMessage) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || fallbackMessage);
  }
  return data;
}

function warmCheckout() {
  if (!checkoutBootstrapPromise) {
    checkoutBootstrapPromise = Promise.all([
      fetch(apiPath('/api/config')).then((response) => readApiJson(response, 'تعذر تحميل إعدادات الدفع.')),
      fetch(apiPath('/api/create-checkout-session'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      }).then((response) => readApiJson(response, 'تعذر تجهيز الدفع.')),
    ]).then(([config, session]) => ({ config, session }));
  }

  return checkoutBootstrapPromise;
}

function resetCheckoutWarmup() {
  checkoutBootstrapPromise = undefined;
}

async function fetchPaidEmail(params) {
  const checkoutSessionId = params.get('checkout_session_id');
  const paymentIntentId = params.get('payment_intent_id');
  const id = checkoutSessionId || paymentIntentId;

  if (!id) return '';

  const response = await fetch(`/api/payment-status?id=${encodeURIComponent(id)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'تعذر تحميل بيانات الطلب.');
  }
  return data.email || '';
}

function detectTikTokBrowser() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('tiktok') === '1') return true;

  const userAgent = `${navigator.userAgent || ''} ${navigator.vendor || ''}`.toLowerCase();
  return /tiktok|musical_ly|bytedance|aweme|ttwebview|zhiliaoapp|snssdk/.test(userAgent);
}

const CHECKOUT_RESUME_MESSAGE = 'LEISH_CHECKOUT_RESUME_CHECKOUT';

function shouldRouteToCheckout() {
  const params = new URLSearchParams(window.location.search);
  return (
    window.location.hash === '#checkout'
    || params.get('checkout') === '1'
    || params.get('checkout_session_id')
    || params.get('payment_intent_id')
  );
}

function isEmbeddedPage() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function checkoutResumeUrl() {
  const url = new URL(window.location.href);
  [
    'checkout_session_id',
    'payment_intent_id',
    'payment_intent_client_secret',
    'redirect_status',
    'tiktok',
  ].forEach((key) => url.searchParams.delete(key));
  url.searchParams.set('checkout', '1');
  url.searchParams.set('open_browser', '1');
  url.hash = 'checkout';
  return url.toString();
}

function preserveCheckoutResume() {
  const resumeUrl = checkoutResumeUrl();
  window.history.replaceState(null, '', resumeUrl);

  if (isEmbeddedPage()) {
    try {
      window.parent.postMessage({ type: CHECKOUT_RESUME_MESSAGE }, '*');
    } catch {
    }
  }
}

function ApplePayMark() {
  return (
    <span className="applePayMark" aria-label="Apple Pay">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.08-.46-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 8.95 7.31c1.32.07 2.24.72 3.02.78 1.16-.24 2.27-.93 3.57-.84 1.56.13 2.73.74 3.51 1.88-3.22 1.93-2.46 6.18.5 7.37-.59 1.55-1.35 3.09-2.5 3.78ZM11.85 7.03c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
      </svg>
      <span>Pay</span>
    </span>
  );
}

function GooglePayMark() {
  return (
    <span className="googlePayMark" aria-label="Google Pay">
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <path fill="#4285f4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z" />
        <path fill="#34a853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33C2.44 15.98 5.48 18 9 18Z" />
        <path fill="#fbbc05" d="M3.96 10.71A5.42 5.42 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33Z" />
        <path fill="#ea4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.33C4.67 5.17 6.66 3.58 9 3.58Z" />
      </svg>
      <span>Pay</span>
    </span>
  );
}

function TikTokWalletFallback({ onClick }) {
  return (
    <div className="tiktokWalletFallback">
      <button className="walletFallbackButton apple" type="button" onClick={onClick}>
        <span>دفع الحساب باستخدام</span>
        <ApplePayMark />
      </button>
      <button className="walletFallbackButton google" type="button" onClick={onClick}>
        <span>إتمام الدفع باستخدام</span>
        <GooglePayMark />
      </button>
    </div>
  );
}

function TikTokOpenBrowserModal({ onClose }) {
  return (
    <div className="tiktokModalOverlay" role="presentation" onClick={onClose}>
      <div className="tiktokGuideArrow" aria-hidden="true">↗</div>
      <div className="tiktokModal" role="dialog" aria-modal="true" aria-labelledby="tiktok-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="tiktokMenuButton" aria-hidden="true">⋯</div>
        <h2 id="tiktok-modal-title">افتح الصفحة في المتصفح</h2>
        <p>Apple Pay و Google Pay لا يعملان داخل متصفح TikTok.</p>
        <p>اضغط زر الثلاث نقاط في أعلى الزاوية، ثم اختر <strong>Open in browser</strong>.</p>
        <button type="button" onClick={onClose}>حسنًا</button>
      </div>
    </div>
  );
}

function CheckoutBox({ onComplete }) {
  const [email, setEmail] = React.useState('');
  const [paidEmail, setPaidEmail] = React.useState('');
  const [status, setStatus] = React.useState('loading');
  const [message, setMessage] = React.useState('');
  const [expressReady, setExpressReady] = React.useState(false);
  const [expressChecked, setExpressChecked] = React.useState(false);
  const isTikTokBrowser = React.useMemo(() => detectTikTokBrowser(), []);
  const [showTikTokHelp, setShowTikTokHelp] = React.useState(() => {
    const params = new URLSearchParams(window.location.search);
    return isTikTokBrowser && params.get('open_browser') === '1';
  });
  const checkoutRef = React.useRef(null);
  const walletElementsRef = React.useRef(null);
  const expressElementRef = React.useRef(null);
  const paymentElementRef = React.useRef(null);
  const actionsRef = React.useRef(null);
  const canUseExpressCheckout = expressReady && status !== 'confirming' && status !== 'complete';
  const canShowTikTokWalletFallback = isTikTokBrowser && status !== 'confirming' && status !== 'complete';

  React.useEffect(() => {
    if (canShowTikTokWalletFallback) {
      trackEventOnce('TikTok Wallet Fallback Shown');
    }
  }, [canShowTikTokWalletFallback]);

  React.useEffect(() => {
    if (showTikTokHelp) {
      trackEvent('TikTok Open Browser Modal Viewed');
    }
  }, [showTikTokHelp]);

  React.useEffect(() => {
    onComplete?.(status === 'complete');
  }, [onComplete, status]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout_session_id') || params.get('payment_intent_id')) {
      setStatus('complete');
      trackEventOnce('Payment Succeeded');
      fetchPaidEmail(params)
        .then((resolvedEmail) => setPaidEmail(resolvedEmail))
        .catch(() => {});
      return undefined;
    }

    let cancelled = false;

    async function initializeCheckout() {
      try {
        const { config, session } = await warmCheckout();

        if (!window.Stripe) {
          throw new Error('لم يتم تحميل Stripe. أعد تحميل الصفحة وحاول مرة ثانية.');
        }

        const stripe = window.Stripe(config.publishableKey, { locale: 'ar' });
        const walletElements = stripe.elements({
          mode: 'payment',
          amount: Number(config.amount),
          currency: String(config.currency || 'sar').toLowerCase(),
          paymentMethodTypes: ['card'],
          appearance: {
            variables: {
              borderRadius: '8px',
              fontFamily: 'IBM Plex Sans Arabic, system-ui, sans-serif',
            },
          },
        });
        const expressCheckoutElement = !isTikTokBrowser
          ? walletElements.create('expressCheckout', {
            buttonHeight: 48,
            buttonType: {
              googlePay: 'checkout',
              applePay: 'check-out',
            },
            buttonTheme: {
              googlePay: 'black',
              applePay: 'black',
            },
            paymentMethodOrder: ['googlePay', 'applePay'],
            layout: {
              maxColumns: 1,
              maxRows: 2,
              overflow: 'auto',
            },
            paymentMethods: {
              googlePay: 'always',
              applePay: 'always',
              link: 'never',
              paypal: 'never',
              amazonPay: 'never',
              klarna: 'never',
            },
            emailRequired: true,
            billingAddressRequired: false,
            lineItems: [
              {
                name: config.productName,
                amount: Number(config.amount),
              },
            ],
          })
          : null;
        const initCheckout = stripe.initCheckoutElementsSdk || stripe.initCheckout;
        const checkout = initCheckout.call(stripe, {
          clientSecret: session.clientSecret,
        });
        const paymentElement = checkout.createPaymentElement({
          layout: {
            type: 'tabs',
          },
          fields: {
            billingDetails: {
              email: 'never',
              name: 'never',
              phone: 'never',
              address: 'if_required',
            },
          },
          terms: {
            card: 'never',
          },
          wallets: {
            applePay: 'never',
            googlePay: 'never',
            link: 'never',
          },
        });

        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (cancelled) return;

        if (expressCheckoutElement) {
          expressCheckoutElement.on('ready', ({ availablePaymentMethods }) => {
            const hasExpressMethod = availablePaymentMethods && Object.values(availablePaymentMethods).some(Boolean);
            if (!cancelled) {
              setExpressChecked(true);
              setExpressReady(Boolean(hasExpressMethod));
            }
          });
          expressCheckoutElement.on('confirm', async (event) => {
            try {
              setStatus('confirming');
              setMessage('');
              trackEvent('Payment Submitted');

              const walletEmail = event.billingDetails?.email || '';
              if (!walletEmail || !walletEmail.includes('@')) {
                event.paymentFailed?.({
                  reason: 'fail',
                  message: 'نحتاج بريدك الإلكتروني حتى نرسل رابط تحميل الكتاب.',
                });
                setStatus('ready');
                setMessage('لم يصل البريد الإلكتروني من المحفظة. أضف بريدًا داخل Apple Pay أو Google Pay وحاول مرة ثانية.');
                return;
              }

              const { error: submitError } = await walletElements.submit();
              if (submitError) {
                throw submitError;
              }

              const intentResponse = await fetch(apiPath('/api/create-wallet-payment-intent'), {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email: walletEmail }),
              });
              const intent = await intentResponse.json();
              if (!intentResponse.ok) {
                throw new Error(intent.error || 'تعذر تجهيز الدفع السريع.');
              }

              const billingDetails = {
                email: walletEmail,
                name: event.billingDetails?.name || undefined,
                phone: event.billingDetails?.phone || undefined,
                address: event.billingDetails?.address || undefined,
              };
              const { error } = await stripe.confirmPayment({
                elements: walletElements,
                clientSecret: intent.clientSecret,
                confirmParams: {
                  return_url: `${window.location.origin}/?payment_intent_id=${intent.paymentIntentId}#checkout`,
                  receipt_email: walletEmail,
                  payment_method_data: {
                    billing_details: billingDetails,
                  },
                },
                redirect: 'if_required',
              });

              if (error) {
                throw error;
              }

              paymentElementRef.current?.destroy();
              paymentElementRef.current = null;
              expressElementRef.current?.destroy();
              expressElementRef.current = null;
              setPaidEmail(walletEmail);
              setStatus('complete');
              trackEvent('Payment Succeeded');
              setMessage('تم الدفع بنجاح. سيرسل رابط تحميل الكتاب إلى بريدك الإلكتروني خلال لحظات.');
            } catch (error) {
              event.paymentFailed?.({
                reason: 'fail',
                message: error.message || 'تعذر إتمام الدفع السريع.',
              });
              setStatus('ready');
              trackEvent('Payment Failed');
              setMessage(error.message || 'تعذر إتمام الدفع السريع.');
            }
          });
        } else if (!cancelled) {
          setExpressChecked(true);
        }

        expressCheckoutElement?.mount('#express-checkout-element');
        paymentElement.mount('#payment-element');

        const loadedActions = await checkout.loadActions();
        if (loadedActions.type === 'error') {
          throw new Error(loadedActions.error?.message || 'تعذر تحميل نموذج الدفع.');
        }

        if (cancelled) return;

        checkoutRef.current = checkout;
        walletElementsRef.current = walletElements;
        expressElementRef.current = expressCheckoutElement;
        paymentElementRef.current = paymentElement;
        actionsRef.current = loadedActions.actions;
        setStatus('ready');
        trackEventOnce('Payment Form Ready');
      } catch (error) {
        if (!cancelled) {
          setStatus('error');
          setMessage(error.message || 'صار خطأ غير متوقع. حاول مرة ثانية.');
        }
      }
    }

    initializeCheckout();

    return () => {
      cancelled = true;
      expressElementRef.current?.destroy();
      paymentElementRef.current?.destroy();
      walletElementsRef.current = null;
    };
  }, [isTikTokBrowser]);

  async function confirmPayment(event) {
    event.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setMessage('اكتب بريدك الإلكتروني حتى نرسل لك رابط تحميل الكتاب بعد الدفع.');
      return;
    }

    if (!actionsRef.current) {
      setMessage('نموذج الدفع لم يجهز بعد. انتظر لحظة وحاول مرة ثانية.');
      return;
    }

    setStatus('confirming');
    setMessage('');
    trackEvent('Payment Submitted');

    try {
      const emailResult = await actionsRef.current.updateEmail(cleanEmail);
      if (emailResult?.type === 'error' || emailResult?.error) {
        const error = emailResult.error || emailResult;
        throw new Error(error.message || 'تأكد من البريد الإلكتروني.');
      }

      const result = await actionsRef.current.confirm({
        redirect: 'if_required',
      });

      if (result?.type === 'error' || result?.error) {
        const error = result.error || result;
        throw new Error(error.message || 'تعذر إتمام الدفع.');
      }

      paymentElementRef.current?.destroy();
      paymentElementRef.current = null;
      setPaidEmail(cleanEmail);
      setStatus('complete');
      trackEvent('Payment Succeeded');
      setMessage('تم الدفع بنجاح. سيرسل رابط تحميل الكتاب إلى بريدك الإلكتروني خلال لحظات.');
    } catch (error) {
      setStatus('ready');
      trackEvent('Payment Failed');
      setMessage(error.message || 'تعذر إتمام الدفع. تحقق من بيانات البطاقة وحاول مرة ثانية.');
      resetCheckoutWarmup();
    }
  }

  const openTikTokHelp = React.useCallback(() => {
    trackEvent('TikTok Wallet Fallback Clicked');
    preserveCheckoutResume();
    setShowTikTokHelp(true);
  }, []);

  const closeTikTokHelp = React.useCallback(() => {
    trackEvent('TikTok Open Browser Modal Closed');
    setShowTikTokHelp(false);
  }, []);

  if (status === 'complete') {
    return <SuccessView email={paidEmail || email.trim()} />;
  }

  return (
    <div className="checkoutBox">
      <form onSubmit={confirmPayment} className="checkoutForm fullCheckoutForm">
        <div className="checkoutSectionTitle">معلومات الطلب</div>
        <div className="checkoutField">
          <label htmlFor="checkout-email">البريد الإلكتروني</label>
          <input id="checkout-email" type="email" dir="ltr" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} disabled={status === 'confirming' || status === 'complete'} />
        </div>

        <div className="checkoutSectionTitle">الدفع</div>
        {status === 'loading' && <div className="paymentLoading">جاري تحميل نموذج الدفع...</div>}
        {canShowTikTokWalletFallback && <TikTokWalletFallback onClick={openTikTokHelp} />}
        <div className={canUseExpressCheckout ? 'expressCheckout ready' : expressChecked ? 'expressCheckout unavailable' : 'expressCheckout'}>
          <div id="express-checkout-element" />
        </div>
        {(canUseExpressCheckout || canShowTikTokWalletFallback) && <div className="checkoutDivider"><span>أو ادفع بالبطاقة</span></div>}
        <div id="payment-element" />

        {message && <p className={status === 'complete' ? 'checkoutSuccess' : 'checkoutMessage'}>{message}</p>}

        <button className="primary" type="submit" disabled={status === 'loading' || status === 'confirming' || status === 'complete' || status === 'error'}>
          {status === 'confirming' ? 'جاري تأكيد الدفع...' : 'ادفع الآن'}
        </button>
      </form>
      {showTikTokHelp && <TikTokOpenBrowserModal onClose={closeTikTokHelp} />}
    </div>
  );
}

function SuccessView({ email }) {
  return (
    <div className="successView">
      <div className="successIcon" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="img">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1>تم الدفع بنجاح</h1>
      <p>أرسلنا رابط تحميل الكتاب إلى بريدك الإلكتروني.</p>
      {email && <strong dir="ltr">{email}</strong>}
      <a className="successBack" href="#">العودة للصفحة</a>
    </div>
  );
}

function CheckoutPage({ product }) {
  const [isComplete, setIsComplete] = React.useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get('checkout_session_id') || params.get('payment_intent_id'));
  });

  React.useEffect(() => {
    trackEventOnce('Checkout Viewed');
  }, []);

  return (
    <main className="checkoutPage">
      <section className={isComplete ? 'checkoutPanel successPanel' : 'checkoutPanel'}>
        {!isComplete && (
          <>
            <div className="checkoutHeader">
              <div className="checkoutTitleRow">
                <a className="checkoutBackIcon" href="#" aria-label="العودة للصفحة">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </a>
                <h1>إتمام الطلب</h1>
              </div>
              <div className="checkoutOrderLine">
                <div className="checkoutOrderProduct">
                  <img className="checkoutOrderThumb" src="/charisma-web-images/book-options-channel-style/book-channel-option-04.webp" alt="" />
                  <span>كتاب {product.productName} الإلكتروني</span>
                </div>
                <strong>{product.priceLabel}</strong>
              </div>
            </div>
          </>
        )}
        <CheckoutBox onComplete={setIsComplete} />
      </section>
    </main>
  );
}

function LandingPage({ product }) {
  const [showStickyBuy, setShowStickyBuy] = React.useState(false);
  const painRef = React.useRef(null);
  const insideRef = React.useRef(null);
  const outcomesRef = React.useRef(null);
  const buyRef = React.useRef(null);

  React.useEffect(() => {
    trackEventOnce('Landing Viewed');
    const warm = () => warmCheckout().catch(resetCheckoutWarmup);
    const idleId = window.requestIdleCallback ? window.requestIdleCallback(warm, { timeout: 1800 }) : window.setTimeout(warm, 800);

    return () => {
      if (window.cancelIdleCallback && typeof idleId === 'number') {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  React.useEffect(() => {
    function updateScrollDepth() {
      const root = document.documentElement;
      const scrollableHeight = root.scrollHeight - window.innerHeight;
      const progress = scrollableHeight <= 0 ? 1 : (window.scrollY + window.innerHeight) / root.scrollHeight;

      if (progress >= 0.5) trackEventOnce('Landing Scroll 50');
      if (progress >= 0.9) trackEventOnce('Landing Scroll 90');
    }

    updateScrollDepth();
    window.addEventListener('scroll', updateScrollDepth, { passive: true });
    window.addEventListener('resize', updateScrollDepth);
    return () => {
      window.removeEventListener('scroll', updateScrollDepth);
      window.removeEventListener('resize', updateScrollDepth);
    };
  }, []);

  React.useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;

    const trackedSections = new Map([
      [painRef.current, 'Section Viewed - Charisma Changes Life'],
      [insideRef.current, 'Section Viewed - What You Learn'],
      [outcomesRef.current, 'Section Viewed - Outcomes'],
      [buyRef.current, 'Section Viewed - Bottom CTA'],
    ].filter(([node]) => Boolean(node)));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const eventName = trackedSections.get(entry.target);
        if (!eventName) return;
        trackEventOnce(eventName);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    trackedSections.forEach((eventName, node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const warmPayment = React.useCallback(() => {
    warmCheckout().catch(resetCheckoutWarmup);
  }, []);

  React.useEffect(() => {
    let frameId = 0;

    function updateStickyBuy() {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const painSection = painRef.current;
        const buySection = buyRef.current;
        if (!painSection || !buySection) return;

        const hasReachedPain = painSection.getBoundingClientRect().top <= window.innerHeight * 0.45;
        const hidePoint = window.innerWidth <= 900 ? window.innerHeight * 0.38 : window.innerHeight * 0.82;
        const beforeBuyCta = buySection.getBoundingClientRect().top > hidePoint;
        setShowStickyBuy(hasReachedPain && beforeBuyCta);
      });
    }

    updateStickyBuy();
    window.addEventListener('scroll', updateStickyBuy, { passive: true });
    window.addEventListener('resize', updateStickyBuy);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', updateStickyBuy);
      window.removeEventListener('resize', updateStickyBuy);
    };
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="copy">
          <h1>كاريزما جذابة</h1>
          <p className="subtitle">أسرار علم النفس للجاذبية والاحترام والقوة الاجتماعية</p>
          <p className="lead">
            كتاب عملي يعلمك كيف ترفع قيمتك أمام الناس: تثق بنفسك، تتكلم بطريقة مؤثرة، تكسب احترامهم، تفهم أسرار النفس، وتبني جاذبية اجتماعية من غير تصنّع.
          </p>
          <div className="actions">
            <a className="primary" href="#checkout" onClick={() => trackBuyClick('Hero')} onPointerEnter={warmPayment} onFocus={warmPayment} onTouchStart={warmPayment}>شراء الكتاب — {product.priceLabel}</a>
          </div>
        </div>
        <div className="coverWrap heroArt">
          <img src="/charisma-web-images/book-options-channel-style/book-channel-option-04-light-bg.webp" alt="صورة منتج كتاب كاريزما جذابة" />
        </div>
      </section>

      <section ref={painRef} className="pain imageSection">
        <div>
          <h2>الكاريزما تغيّر حياتك</h2>
          <div className="problemGrid">
            {desires.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
        <img className="sideImage" src="/charisma-web-images/charisma-force-godlike.webp" alt="قوة الكاريزما" />
      </section>

      <section className="truth">
        <p>
          أكيد تعرف شخصًا عندما يدخل المكان ينتبه له الناس، وعندما يتكلم يصمتون ليسمعوه. ليس لأنه الأعلى صوتًا أو الأجمل شكلًا، بل لأن طريقته تقول: أنا واثق، واضح، وأعرف قيمتي.
        </p>
        <h2>الكاريزما هي مزيج من الثقة، الذكاء الاجتماعي، وطريقة الكلام التي تجعل الناس ينجذبون لك.</h2>
        <p>
          ستفهم لماذا تهتز ثقتك، لماذا تشعر بالوحدة رغم وعيك، لماذا يستسهل البعض التعامل معك، وكيف تصبح أكثر تأثيرًا وجاذبية ونجاحًا في علاقاتك وقراراتك.
        </p>
      </section>

      <section id="path" ref={insideRef} className="inside">
        <h2>ماذا ستتعلم؟</h2>
        <div className="insideGrid">
          {path.map(([num, title, text, img]) => (
            <article key={title}>
              <img src={img} alt="" />
              <div>
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="tocSection">
        <h2>فهرس الكتاب</h2>
        <div className="tocGrid">
          {toc.map((item, index) => (
            <div className="tocItem" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={outcomesRef} className="outcomes">
        <h2>خلّهم يتعلقون بحضورك</h2>
        <ul>
          {outcomes.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section id="buy" ref={buyRef} className="buy">
        <img className="buyImage" src="/charisma-web-images/cta-godlike-no-book.webp" alt="بناء الكاريزما" />
        <div>
          <h2>جاهز تبني كاريزمتك؟</h2>
          <p>نسخة PDF فورية من كتاب <strong>كاريزما جذابة</strong>. بعد الدفع يصلك رابط التحميل على بريدك الإلكتروني.</p>
        </div>
        <div className="buyCard">
          <strong>{product.priceLabel}</strong>
          <a className="primary" href="#checkout" onClick={() => trackBuyClick('Bottom CTA')} onPointerEnter={warmPayment} onFocus={warmPayment} onTouchStart={warmPayment}>إتمام الشراء</a>
        </div>
      </section>

      <div className={showStickyBuy ? 'fixedBuy show' : 'fixedBuy'}>
        <div><strong>{product.priceLabel}</strong></div>
        <a href="#checkout" onClick={() => { trackBuyClick('Sticky'); trackEvent('Sticky CTA Clicked'); }} onPointerEnter={warmPayment} onFocus={warmPayment} onTouchStart={warmPayment}>اشتري الكتاب</a>
      </div>
    </main>
  );
}

function App() {
  const [productConfig, setProductConfig] = React.useState(DEFAULT_PRODUCT_CONFIG);
  const [route, setRoute] = React.useState(() => shouldRouteToCheckout() ? 'checkout' : 'landing');

  React.useEffect(() => {
    fetch(apiPath('/api/config'))
      .then((response) => response.json())
      .then((config) => {
        if (config?.priceLabel) {
          setProductConfig({ ...DEFAULT_PRODUCT_CONFIG, ...config });
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    function syncRoute() {
      setRoute(shouldRouteToCheckout() ? 'checkout' : 'landing');
    }

    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  React.useEffect(() => {
    document.body.classList.toggle('checkoutMode', route === 'checkout');
    return () => document.body.classList.remove('checkoutMode');
  }, [route]);

  return route === 'checkout' ? <CheckoutPage product={productConfig} /> : <LandingPage product={productConfig} />;
}

createRoot(document.getElementById('root')).render(<App />);
