# Cloudflare + Stripe Checkout

This project uses one same-page Stripe Payment Element flow:

- React mounts Stripe's Payment Element inside the Arabic book page.
- Cloudflare Pages Functions create the Checkout Session.
- Stripe webhooks mark the order as paid in D1.
- Resend sends the buyer a private Cloudflare download link.
- The download route serves the PDF from a private R2 bucket.

## Required Cloudflare Resources

Created resources:

- Cloudflare Pages project: `qowat-alhodoor-product-page`
- Cloudflare Pages URL: `https://qowat-alhodoor-product-page.pages.dev`
- D1 database: `qowat-alhodoor-orders`
- D1 database ID: `2a8f6a0c-033b-41dd-9d32-caabd450511d`
- R2 bucket: `qowat-alhodoor-books`
- Resend domain: `leish.shop`

Upload the private PDF after Wrangler is authenticated:

```bash
npx wrangler r2 object put qowat-alhodoor-books/karezma-jathaba-final.pdf --file private/karezma-jathaba-final.pdf --remote
```

## Required Secrets

```bash
npx wrangler pages secret put STRIPE_PUBLISHABLE_KEY --project-name qowat-alhodoor-product-page
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name qowat-alhodoor-product-page
npx wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name qowat-alhodoor-product-page
npx wrangler pages secret put RESEND_API_KEY --project-name qowat-alhodoor-product-page
npx wrangler pages secret put FROM_EMAIL --project-name qowat-alhodoor-product-page
```

Use `FROM_EMAIL=noreply@leish.shop` after `leish.shop` is verified in Resend.
`SITE_URL` is configured in `wrangler.toml`.

## Stripe Setup

Use this webhook endpoint:

```text
https://qowat-alhodoor-product-page.pages.dev/api/stripe-webhook
```

Enable these events:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
```

The checkout is configured with Checkout Sessions + Payment Element using `ui_mode=elements`, Stripe API `2026-03-25.dahlia`, `redirect=if_required`, and `PAYMENT_METHOD_TYPES=card`. This keeps card entry and most 3DS/OTP challenges inside the page, which is the safest setup for TikTok's in-app browser. Redirect-based bank payment methods are intentionally not enabled by default because they can trigger external-browser prompts.

## Deploy

Cloudflare Pages settings:

```text
Build command: npm run build
Build output directory: dist
```

Manual deploy:

```bash
npm run build
npx wrangler pages deploy dist --project-name qowat-alhodoor-product-page
```
