export async function sendBookEmail(env, email, token) {
  if (!env.RESEND_API_KEY) {
    throw new Error('Missing environment variable: RESEND_API_KEY');
  }

  if (!env.FROM_EMAIL) {
    throw new Error('Missing environment variable: FROM_EMAIL');
  }

  const siteUrl = (env.SITE_URL || '').replace(/\/$/, '');
  const downloadUrl = `${siteUrl}/api/download/${token}`;
  const productName = env.BOOK_PRODUCT_NAME || 'كاريزما جذابة';
  const safeProductName = escapeHtml(productName);
  const safeDownloadUrl = escapeHtml(downloadUrl);

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #151515;">
      <h1 style="font-size: 24px;">كتابك جاهز</h1>
      <p>شكرًا لشرائك كتاب <strong>${safeProductName}</strong>.</p>
      <p>اضغط على الرابط التالي لتحميل نسخة PDF:</p>
      <p><a href="${safeDownloadUrl}" style="display: inline-block; padding: 12px 18px; background: #d35400; color: #fff; border-radius: 10px; text-decoration: none;">تحميل الكتاب</a></p>
      <p style="color: #666;">الرابط خاص بك. إذا لم يعمل الزر، انسخ هذا الرابط وافتحه في المتصفح:</p>
      <p dir="ltr" style="word-break: break-all;">${safeDownloadUrl}</p>
    </div>
  `;

  const text = [
    'كتابك جاهز',
    '',
    `شكرًا لشرائك كتاب ${productName}.`,
    `رابط التحميل: ${downloadUrl}`,
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      to: email,
      from: env.FROM_EMAIL,
      subject: `كتابك جاهز: ${productName}`,
      html,
      text,
    }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const reason = data.message || data.error || 'Resend request failed';
    throw new Error(`Email delivery failed: ${reason}`);
  }

  return data;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
