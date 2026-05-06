import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const desires = [
  ['تريد أن تُسمع', 'عندك أفكار، لكنك تريد طريقة تجعل كلامك يصل بوضوح ووزن.'],
  ['تريد أن تُحترم', 'لا تريد أن تكون الشخص السهل الذي تُؤخذ طيبته كأمر مضمون.'],
  ['تريد أن تؤثر', 'تريد فهم النفوذ، الإقناع، وقراءة الناس من غير تلاعب رخيص.'],
  ['تريد علاقات أنجح', 'تريد جاذبية طبيعية، قربًا مريحًا، واحترامًا لا يكسرك ولا يبعد الناس عنك.'],
];

const path = [
  ['01', 'ثقة لا تهتز', 'القوة الداخلية، الذكاء العاطفي، الثقة الثابتة، والتخلص من تأجيل حياتك.', '/charisma-web-images/confidence-godlike-no-eyes.png'],
  ['02', 'هيبة وكلام يُسمع', 'الكاريزما، الكلام المؤثر، قراءة الناس، والحدود التي تصنع الاحترام.', '/charisma-web-images/enter-room-power.png'],
  ['03', 'قوة التأثير وكشف التلاعب', 'القيادة، النفوذ الخفي، كشف التلاعب، وحماية نفسك من الاستغلال.', '/charisma-web-images/leadership-power.png'],
  ['04', 'جاذبية وعلاقات ناجحة', 'تغيير صورتك أمام الناس، الصداقة، الجاذبية، وتثبيت نسختك الجديدة.', '/charisma-web-images/relationships-power.png'],
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

let checkoutBootstrapPromise;

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
      fetch('/api/config').then((response) => readApiJson(response, 'تعذر تحميل إعدادات الدفع.')),
      fetch('/api/create-checkout-session', {
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

function getApplePayAvailability() {
  try {
    if (typeof window.ApplePaySession !== 'function') return false;
    return window.ApplePaySession.canMakePayments();
  } catch {
    return false;
  }
}

function CheckoutBox({ onComplete }) {
  const [email, setEmail] = React.useState('');
  const [paidEmail, setPaidEmail] = React.useState('');
  const [status, setStatus] = React.useState('loading');
  const [message, setMessage] = React.useState('');
  const [expressReady, setExpressReady] = React.useState(false);
  const [expressChecked, setExpressChecked] = React.useState(false);
  const [walletDebug, setWalletDebug] = React.useState('');
  const checkoutRef = React.useRef(null);
  const walletElementsRef = React.useRef(null);
  const expressElementRef = React.useRef(null);
  const paymentElementRef = React.useRef(null);
  const actionsRef = React.useRef(null);
  const canUseExpressCheckout = expressReady && status !== 'confirming' && status !== 'complete';
  const showWalletDebug = new URLSearchParams(window.location.search).get('wallet_debug') === '1';

  React.useEffect(() => {
    onComplete?.(status === 'complete');
  }, [onComplete, status]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout_session_id') || params.get('payment_intent_id')) {
      setStatus('complete');
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
        const expressCheckoutElement = walletElements.create('expressCheckout', {
          buttonHeight: 48,
          buttonType: {
            applePay: 'check-out',
            googlePay: 'checkout',
          },
          layout: {
            maxColumns: 1,
            maxRows: 2,
            overflow: 'auto',
          },
          paymentMethods: {
            applePay: 'always',
            googlePay: 'always',
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
        });
        const checkout = stripe.initCheckoutElementsSdk({
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

        expressCheckoutElement.on('ready', ({ availablePaymentMethods }) => {
          const debugPayload = {
            availablePaymentMethods: availablePaymentMethods || null,
            isSecureContext: window.isSecureContext,
            hasPaymentRequest: typeof window.PaymentRequest === 'function',
            hasApplePaySession: typeof window.ApplePaySession === 'function',
            appleCanMakePayments: getApplePayAvailability(),
            userAgent: navigator.userAgent,
          };
          console.info('Stripe express checkout payment methods:', debugPayload);
          const hasExpressMethod = availablePaymentMethods && Object.values(availablePaymentMethods).some(Boolean);
          if (!cancelled) {
            setExpressChecked(true);
            setExpressReady(Boolean(hasExpressMethod));
            setWalletDebug(JSON.stringify(debugPayload, null, 2));
          }
        });
        expressCheckoutElement.on('confirm', async (event) => {
          try {
            setStatus('confirming');
            setMessage('');

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

            const intentResponse = await fetch('/api/create-wallet-payment-intent', {
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
            setMessage('تم الدفع بنجاح. سيرسل رابط تحميل الكتاب إلى بريدك الإلكتروني خلال لحظات.');
          } catch (error) {
            event.paymentFailed?.({
              reason: 'fail',
              message: error.message || 'تعذر إتمام الدفع السريع.',
            });
            setStatus('ready');
            setMessage(error.message || 'تعذر إتمام الدفع السريع.');
          }
        });

        expressCheckoutElement.mount('#express-checkout-element');
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
  }, []);

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
      setMessage('تم الدفع بنجاح. سيرسل رابط تحميل الكتاب إلى بريدك الإلكتروني خلال لحظات.');
    } catch (error) {
      setStatus('ready');
      setMessage(error.message || 'تعذر إتمام الدفع. تحقق من بيانات البطاقة وحاول مرة ثانية.');
      resetCheckoutWarmup();
    }
  }

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
        <div className={canUseExpressCheckout ? 'expressCheckout ready' : expressChecked ? 'expressCheckout unavailable' : 'expressCheckout'}>
          <div id="express-checkout-element" />
        </div>
        {showWalletDebug && walletDebug && <pre className="walletDebug" dir="ltr">{walletDebug}</pre>}
        {canUseExpressCheckout && <div className="checkoutDivider"><span>أو ادفع بالبطاقة</span></div>}
        <div id="payment-element" />

        {message && <p className={status === 'complete' ? 'checkoutSuccess' : 'checkoutMessage'}>{message}</p>}

        <button className="primary" type="submit" disabled={status === 'loading' || status === 'confirming' || status === 'complete' || status === 'error'}>
          {status === 'confirming' ? 'جاري تأكيد الدفع...' : 'ادفع الآن'}
        </button>
      </form>
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

function CheckoutPage() {
  const [isComplete, setIsComplete] = React.useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get('checkout_session_id') || params.get('payment_intent_id'));
  });

  return (
    <main className="checkoutPage">
      <section className={isComplete ? 'checkoutPanel successPanel' : 'checkoutPanel'}>
        {!isComplete && (
          <>
            <a className="backLink" href="#">العودة للصفحة</a>
            <div className="checkoutHeader">
              <h1>إتمام الطلب</h1>
              <div className="checkoutOrderLine">
                <span>كتاب كاريزما جذابة</span>
                <strong>55 ريال</strong>
              </div>
            </div>
          </>
        )}
        <CheckoutBox onComplete={setIsComplete} />
      </section>
    </main>
  );
}

function LandingPage() {
  React.useEffect(() => {
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

  const warmPayment = React.useCallback(() => {
    warmCheckout().catch(resetCheckoutWarmup);
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="copy">
          <h1>كاريزما جذابة</h1>
          <p className="subtitle">أسرار علم النفس للجاذبية والاحترام والقوة الاجتماعية</p>
          <p className="lead">
            كتاب عملي يعلمك كيف ترفع قيمتك أمام الناس: تثق بنفسك، تتكلم بطريقة مؤثرة، تضع حدودًا تجعلهم يحترمونك، تفهم أسرار النفس، وتبني جاذبية اجتماعية من غير تصنّع.
          </p>
          <div className="actions">
            <a className="primary" href="#checkout" onPointerEnter={warmPayment} onFocus={warmPayment} onTouchStart={warmPayment}>شراء الكتاب — 55 ريال</a>
            <a className="ghost" href="#path">شاهد محتوى الكتاب</a>
          </div>
        </div>
        <div className="coverWrap heroArt">
          <img src="/charisma-web-images/book-options-channel-style/book-channel-option-04-light-bg.png" alt="صورة منتج كتاب كاريزما جذابة" />
        </div>
      </section>

      <section className="pain imageSection">
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
        <img className="sideImage" src="/charisma-web-images/charisma-force-godlike.png" alt="قوة الكاريزما" />
      </section>

      <section className="truth">
        <p>
          أكيد تعرف شخصًا عندما يدخل المكان ينتبه له الناس، وعندما يتكلم يصمتون ليسمعوه. ليس لأنه الأعلى صوتًا أو الأجمل شكلًا، بل لأن طريقته تقول: أنا واثق، واضح، وأعرف قيمتي.
        </p>
        <h2>هذه هي الكاريزما: أن تُشعر الناس بقيمتك قبل أن تشرحها لهم.</h2>
        <p>
          ستفهم لماذا تهتز ثقتك، لماذا تشعر بالوحدة رغم وعيك، لماذا يستسهل البعض التعامل معك، وكيف تصبح أكثر تأثيرًا وجاذبية ونجاحًا في علاقاتك وقراراتك.
        </p>
      </section>

      <section id="path" className="inside">
        <h2>الطريق داخل الكتاب</h2>
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

      <section className="outcomes">
        <h2>ماذا ستأخذ منه؟</h2>
        <ul>
          {outcomes.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section id="buy" className="buy">
        <img className="buyImage" src="/charisma-web-images/cta-godlike-no-book.png" alt="بناء الكاريزما" />
        <div>
          <h2>جاهز تبني كاريزمتك؟</h2>
          <p>نسخة PDF فورية من كتاب <strong>كاريزما جذابة</strong>. بعد الدفع يصلك رابط التحميل على بريدك الإلكتروني.</p>
        </div>
        <div className="buyCard">
          <strong>55 ريال</strong>
          <a className="primary" href="#checkout" onPointerEnter={warmPayment} onFocus={warmPayment} onTouchStart={warmPayment}>إتمام الشراء</a>
          <small>الدفع داخل نفس الصفحة بدون فتح نافذة جديدة.</small>
        </div>
      </section>

      <div className="fixedBuy">
        <div><span>كاريزما جذابة</span><strong>55 ريال</strong></div>
        <a href="#checkout" onPointerEnter={warmPayment} onFocus={warmPayment} onTouchStart={warmPayment}>اشتر الآن</a>
      </div>
    </main>
  );
}

function App() {
  const [route, setRoute] = React.useState(() => {
    const params = new URLSearchParams(window.location.search);
    return window.location.hash === '#checkout' || params.get('checkout_session_id') ? 'checkout' : 'landing';
  });

  React.useEffect(() => {
    function syncRoute() {
      const params = new URLSearchParams(window.location.search);
      setRoute(window.location.hash === '#checkout' || params.get('checkout_session_id') ? 'checkout' : 'landing');
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

  return route === 'checkout' ? <CheckoutPage /> : <LandingPage />;
}

createRoot(document.getElementById('root')).render(<App />);
