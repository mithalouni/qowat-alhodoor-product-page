import { json, requireEnv } from '../_lib/http.js';

export async function onRequestGet({ env }) {
  try {
    requireEnv(env, ['STRIPE_PUBLISHABLE_KEY']);

    return json({
      publishableKey: env.STRIPE_PUBLISHABLE_KEY,
      productName: env.BOOK_PRODUCT_NAME || 'كاريزما جذابة',
      amount: Number(env.BOOK_PRICE_AMOUNT || 5500),
      currency: env.BOOK_CURRENCY || 'sar',
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
