import { json, readJson, requireEnv } from '../_lib/http.js';
import { createWalletPaymentIntent } from '../_lib/stripe.js';

export async function onRequestPost({ request, env }) {
  try {
    requireEnv(env, ['STRIPE_SECRET_KEY']);

    const { email } = await readJson(request);
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (cleanEmail && !cleanEmail.includes('@')) {
      return json({ error: 'البريد الإلكتروني من المحفظة غير صحيح.' }, { status: 400 });
    }

    const intent = await createWalletPaymentIntent(env, cleanEmail);

    return json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    });
  } catch (error) {
    return json({ error: error.message || 'تعذر تجهيز الدفع السريع.' }, { status: 500 });
  }
}
