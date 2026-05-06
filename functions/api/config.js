import { json, requireEnv } from '../_lib/http.js';
import { getPricingForRequest } from '../_lib/pricing.js';

export async function onRequestGet({ request, env }) {
  try {
    requireEnv(env, ['STRIPE_PUBLISHABLE_KEY']);
    const pricing = getPricingForRequest(request, env);

    return json({
      publishableKey: env.STRIPE_PUBLISHABLE_KEY,
      productName: env.BOOK_PRODUCT_NAME || 'كاريزما جذابة',
      amount: pricing.amount,
      country: pricing.country,
      currency: pricing.currency,
      currencyCode: pricing.currencyCode,
      priceLabel: pricing.priceLabel,
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
