import { requireEnv } from '../../_lib/http.js';

export async function onRequestGet({ env, params }) {
  try {
    requireEnv(env, ['DB', 'BOOK_FILES', 'BOOK_PDF_KEY']);

    const token = String(params.token || '').trim();
    if (!token) return notFound();

    const order = await env.DB.prepare(`
      SELECT id
      FROM orders
      WHERE download_token = ?
        AND status = 'paid'
        AND download_expires_at > datetime('now')
      LIMIT 1
    `).bind(token).first();

    if (!order) return notFound();

    const object = await env.BOOK_FILES.get(env.BOOK_PDF_KEY);
    if (!object) return notFound();

    await env.DB.prepare(`
      UPDATE orders
      SET download_count = download_count + 1,
          last_downloaded_at = datetime('now'),
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(order.id).run();

    return new Response(object.body, {
      headers: {
        'content-type': object.httpMetadata?.contentType || 'application/pdf',
        'content-disposition': 'attachment; filename="karezma-jathaba.pdf"',
        'cache-control': 'private, no-store',
      },
    });
  } catch (error) {
    return new Response(error.message || 'Download failed', { status: 500 });
  }
}

function notFound() {
  return new Response('Not found', { status: 404 });
}
