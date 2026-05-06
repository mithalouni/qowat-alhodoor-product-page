const STRIPE_API_VERSION = '2026-03-25.dahlia';

export async function createPaymentElementCheckoutSession(env, origin, email) {
  const amount = env.BOOK_PRICE_AMOUNT || '5500';
  const currency = (env.BOOK_CURRENCY || 'sar').toLowerCase();
  const productName = env.BOOK_PRODUCT_NAME || 'كاريزما جذابة';
  const returnUrl = `${origin}/?checkout_session_id={CHECKOUT_SESSION_ID}#checkout`;

  const body = new URLSearchParams();
  body.set('mode', 'payment');
  body.set('ui_mode', 'elements');
  body.set('return_url', returnUrl);
  body.set('client_reference_id', crypto.randomUUID());
  if (email) {
    body.set('customer_email', email);
  }
  body.set('line_items[0][quantity]', '1');

  if (env.BOOK_PRICE_ID) {
    body.set('line_items[0][price]', env.BOOK_PRICE_ID);
  } else {
    body.set('line_items[0][price_data][currency]', currency);
    body.set('line_items[0][price_data][unit_amount]', String(amount));
    body.set('line_items[0][price_data][product_data][name]', productName);
  }

  const paymentMethodTypes = (env.PAYMENT_METHOD_TYPES || 'card')
    .split(',')
    .map((type) => type.trim())
    .filter((type) => type !== 'link')
    .filter(Boolean);
  paymentMethodTypes.forEach((type, index) => {
    body.set(`payment_method_types[${index}]`, type);
  });

  body.set('metadata[product]', 'qowat-alhodoor');
  body.set('metadata[delivery]', 'email_download_link');
  body.set('payment_intent_data[metadata][product]', 'qowat-alhodoor');

  return stripeFetch(env, '/checkout/sessions', {
    method: 'POST',
    body,
  });
}

export async function createWalletPaymentIntent(env, email) {
  const amount = env.BOOK_PRICE_AMOUNT || '5500';
  const currency = (env.BOOK_CURRENCY || 'sar').toLowerCase();
  const productName = env.BOOK_PRODUCT_NAME || 'كاريزما جذابة';
  const cleanEmail = String(email || '').trim().toLowerCase();

  const body = new URLSearchParams();
  body.set('amount', String(amount));
  body.set('currency', currency);
  body.set('payment_method_types[0]', 'card');
  body.set('description', productName);
  if (cleanEmail) {
    body.set('receipt_email', cleanEmail);
  }
  body.set('metadata[product]', 'qowat-alhodoor');
  body.set('metadata[delivery]', 'email_download_link');
  body.set('metadata[source]', 'express_wallet');

  return stripeFetch(env, '/payment_intents', {
    method: 'POST',
    body,
  });
}

export async function verifyStripeWebhook(request, env) {
  const signature = request.headers.get('stripe-signature') || '';
  const rawBody = await request.text();
  const timestamp = getSignaturePart(signature, 't');
  const signatures = signature
    .split(',')
    .filter((part) => part.startsWith('v1='))
    .map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) {
    throw new Error('Missing Stripe signature');
  }

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) {
    throw new Error('Expired Stripe signature');
  }

  const expected = await hmacSha256Hex(env.STRIPE_WEBHOOK_SECRET, `${timestamp}.${rawBody}`);
  const verified = signatures.some((value) => timingSafeEqual(value, expected));

  if (!verified) {
    throw new Error('Invalid Stripe signature');
  }

  return JSON.parse(rawBody);
}

async function stripeFetch(env, path, { method = 'GET', body } = {}) {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'content-type': 'application/x-www-form-urlencoded',
      'stripe-version': env.STRIPE_API_VERSION || STRIPE_API_VERSION,
    },
    body,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Stripe request failed');
  }

  return data;
}

function getSignaturePart(header, key) {
  const part = header.split(',').find((value) => value.startsWith(`${key}=`));
  return part ? part.slice(key.length + 1) : null;
}

async function hmacSha256Hex(secret, payload) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return result === 0;
}
