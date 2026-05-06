import { json, readJson, requireEnv } from '../_lib/http.js';
import { getPricingForRequest } from '../_lib/pricing.js';
import { createPaymentElementCheckoutSession } from '../_lib/stripe.js';

export async function onRequestPost({ request, env }) {
  try {
    requireEnv(env, ['DB', 'STRIPE_SECRET_KEY']);

    const { email } = await readJson(request);
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (cleanEmail && !cleanEmail.includes('@')) {
      return json({ error: 'اكتب بريدًا إلكترونيًا صحيحًا.' }, { status: 400 });
    }

    const origin = env.SITE_URL || new URL(request.url).origin;
    const pricing = getPricingForRequest(request, env);
    const session = await createPaymentElementCheckoutSession(env, origin, cleanEmail, pricing);

    await env.DB.prepare(`
      INSERT INTO orders (
        id,
        stripe_session_id,
        customer_email,
        amount_total,
        currency,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(stripe_session_id) DO UPDATE SET
        customer_email = excluded.customer_email,
        updated_at = datetime('now')
    `).bind(
      crypto.randomUUID(),
      session.id,
      cleanEmail || '',
      session.amount_total,
      session.currency,
      'checkout_created',
    ).run();

    return json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    return json({ error: error.message || 'تعذر تجهيز الدفع.' }, { status: 500 });
  }
}
