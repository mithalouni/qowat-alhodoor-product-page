import { sendBookEmail } from '../_lib/delivery.js';
import { json, requireEnv } from '../_lib/http.js';
import { verifyStripeWebhook } from '../_lib/stripe.js';

export async function onRequestPost({ request, env }) {
  try {
    requireEnv(env, [
      'DB',
      'STRIPE_WEBHOOK_SECRET',
      'FROM_EMAIL',
      'SITE_URL',
      'RESEND_API_KEY',
    ]);

    const event = await verifyStripeWebhook(request, env);

    await env.DB.prepare(`
      INSERT OR IGNORE INTO stripe_events (id, type, payload, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `).bind(event.id, event.type, JSON.stringify(event)).run();

    const storedEvent = await env.DB.prepare(`
      SELECT processed_at
      FROM stripe_events
      WHERE id = ?
    `).bind(event.id).first();

    if (storedEvent?.processed_at) {
      return json({ received: true, duplicate: true });
    }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      await deliverPaidOrder(env, event.data.object);
    }

    if (event.type === 'payment_intent.succeeded') {
      await deliverPaidPaymentIntent(env, event.data.object);
    }

    await env.DB.prepare(`
      UPDATE stripe_events
      SET processed_at = datetime('now'), processing_error = NULL
      WHERE id = ?
    `).bind(event.id).run();

    return json({ received: true });
  } catch (error) {
    return json({ error: error.message || 'Webhook failed' }, { status: 400 });
  }
}

async function deliverPaidPaymentIntent(env, intent) {
  const email = intent.receipt_email || intent.charges?.data?.[0]?.billing_details?.email;

  if (!email) {
    throw new Error(`No customer email for payment intent ${intent.id}`);
  }

  const existing = await env.DB.prepare(`
    SELECT id, download_token, email_sent_at
    FROM orders
    WHERE stripe_payment_intent = ?
  `).bind(intent.id).first();
  const token = existing?.download_token || crypto.randomUUID().replaceAll('-', '');
  const syntheticSessionId = `wallet:${intent.id}`;

  await env.DB.prepare(`
    INSERT INTO orders (
      id,
      stripe_session_id,
      stripe_payment_intent,
      customer_email,
      amount_total,
      currency,
      status,
      download_token,
      download_expires_at,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '+30 days'), datetime('now'), datetime('now'))
    ON CONFLICT(stripe_session_id) DO UPDATE SET
      stripe_payment_intent = excluded.stripe_payment_intent,
      customer_email = excluded.customer_email,
      amount_total = excluded.amount_total,
      currency = excluded.currency,
      status = excluded.status,
      download_token = COALESCE(orders.download_token, excluded.download_token),
      download_expires_at = COALESCE(orders.download_expires_at, excluded.download_expires_at),
      updated_at = datetime('now')
  `).bind(
    crypto.randomUUID(),
    syntheticSessionId,
    intent.id,
    email.toLowerCase(),
    intent.amount_received || intent.amount || 0,
    intent.currency || null,
    'paid',
    token,
  ).run();

  const order = await env.DB.prepare(`
    SELECT id, download_token, email_sent_at
    FROM orders
    WHERE stripe_payment_intent = ?
  `).bind(intent.id).first();

  if (!order.email_sent_at) {
    await sendBookEmail(env, email, order.download_token);

    await env.DB.prepare(`
      UPDATE orders
      SET email_sent_at = datetime('now'), updated_at = datetime('now')
      WHERE id = ?
    `).bind(order.id).run();
  }
}

async function deliverPaidOrder(env, session) {
  const email = session.customer_details?.email || session.customer_email;

  if (!email) {
    throw new Error(`No customer email for session ${session.id}`);
  }

  const existing = await env.DB.prepare(`
    SELECT download_token, email_sent_at
    FROM orders
    WHERE stripe_session_id = ?
  `).bind(session.id).first();
  const token = existing?.download_token || crypto.randomUUID().replaceAll('-', '');

  await env.DB.prepare(`
    INSERT INTO orders (
      id,
      stripe_session_id,
      stripe_payment_intent,
      customer_email,
      amount_total,
      currency,
      status,
      download_token,
      download_expires_at,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '+30 days'), datetime('now'), datetime('now'))
    ON CONFLICT(stripe_session_id) DO UPDATE SET
      stripe_payment_intent = excluded.stripe_payment_intent,
      customer_email = excluded.customer_email,
      amount_total = excluded.amount_total,
      currency = excluded.currency,
      status = excluded.status,
      download_token = COALESCE(orders.download_token, excluded.download_token),
      download_expires_at = COALESCE(orders.download_expires_at, excluded.download_expires_at),
      updated_at = datetime('now')
  `).bind(
    crypto.randomUUID(),
    session.id,
    session.payment_intent || null,
    email.toLowerCase(),
    session.amount_total || 0,
    session.currency || null,
    'paid',
    token,
  ).run();

  const order = await env.DB.prepare(`
    SELECT id, download_token, email_sent_at
    FROM orders
    WHERE stripe_session_id = ?
  `).bind(session.id).first();

  if (!order.email_sent_at) {
    await sendBookEmail(env, email, order.download_token);

    await env.DB.prepare(`
      UPDATE orders
      SET email_sent_at = datetime('now'), updated_at = datetime('now')
      WHERE id = ?
    `).bind(order.id).run();
  }
}
