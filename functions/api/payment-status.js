import { json, requireEnv } from '../_lib/http.js';

export async function onRequestGet({ request, env }) {
  try {
    requireEnv(env, ['DB']);

    const id = new URL(request.url).searchParams.get('id') || '';
    if (!id) {
      return json({ error: 'Missing payment id.' }, { status: 400 });
    }

    const order = await env.DB.prepare(`
      SELECT customer_email, status
      FROM orders
      WHERE stripe_session_id = ?
         OR stripe_payment_intent = ?
         OR stripe_session_id = ?
      ORDER BY updated_at DESC
      LIMIT 1
    `).bind(id, id, `wallet:${id}`).first();

    if (!order) {
      return json({ email: '', status: 'pending' });
    }

    return json({
      email: order.customer_email || '',
      status: order.status || 'pending',
    });
  } catch (error) {
    return json({ error: error.message || 'تعذر تحميل بيانات الطلب.' }, { status: 500 });
  }
}
