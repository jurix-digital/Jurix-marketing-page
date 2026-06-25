// Lightweight transactional email helper for Jurix website forms.
//
// Uses Brevo's (Sendinblue) transactional email REST API via fetch, so no extra
// npm dependency is required. All addresses/keys are configurable via env vars.
//
// Required env:
//   BREVO_API_KEY            - Brevo transactional API key
// Optional env (with sensible defaults):
//   EMAIL_FROM               - verified sender address (default: hello@jurix.law)
//   EMAIL_FROM_NAME          - sender display name   (default: "Jurix Website")
//   CONTACT_NOTIFY_TO        - recipient address     (default: hello@jurix.law)
//   EMAIL_LOGO_URL           - absolute logo URL for the template
//                              (default: https://www.jurix.law/img/logo.png)

const BRAND = {
  gold: '#8D621A',
  goldDeep: '#5E3F12',
  ink: '#241B0E',
  muted: '#6B6256',
  cream: '#F3ECDD',
  card: '#FFFFFF',
  line: '#E7DCC6',
};

export const NOTIFY_TO = process.env.CONTACT_NOTIFY_TO || 'hello@jurix.law';
const FROM_EMAIL = process.env.EMAIL_FROM || 'hello@jurix.law';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Jurix Website';
const LOGO_URL = process.env.EMAIL_LOGO_URL || 'https://www.jurix.law/img/logo.png';

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type Field = { label: string; value: unknown };

function rowsHtml(fields: Field[]): string {
  return fields
    .filter((f) => f.value !== undefined && f.value !== null && String(f.value).trim() !== '')
    .map((f) => {
      const value = escapeHtml(f.value).replace(/\n/g, '<br/>');
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid ${BRAND.line};font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${BRAND.gold};white-space:nowrap;vertical-align:top;width:170px;">${escapeHtml(
            f.label
          )}</td>
          <td style="padding:12px 16px;border-bottom:1px solid ${BRAND.line};font-size:15px;color:${BRAND.ink};line-height:1.5;vertical-align:top;">${value}</td>
        </tr>`;
    })
    .join('');
}

function baseTemplate(opts: { heading: string; intro: string; fields: Field[] }): string {
  const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BRAND.cream};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${BRAND.card};border:1px solid ${BRAND.line};border-radius:18px;overflow:hidden;">
            <tr>
              <td align="center" style="background:#FFFDF8;padding:26px 24px 18px;border-bottom:1px solid ${BRAND.line};">
                <img src="${LOGO_URL}" alt="Jurix" height="36" style="display:block;height:36px;width:auto;border:0;outline:none;text-decoration:none;" />
              </td>
            </tr>
            <tr>
              <td style="height:4px;background:${BRAND.gold};font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px;">
                <h1 style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:${BRAND.ink};">${escapeHtml(
                  opts.heading
                )}</h1>
                <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND.muted};line-height:1.5;">${escapeHtml(
                  opts.intro
                )}</p>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${BRAND.muted};">Received: ${escapeHtml(
                  submittedAt
                )} IST</p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 28px 26px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;border:1px solid ${BRAND.line};border-radius:12px;border-collapse:separate;overflow:hidden;">
                  ${rowsHtml(opts.fields)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 28px;border-top:1px solid ${BRAND.line};font-family:Arial,Helvetica,sans-serif;">
                <p style="margin:0;font-size:12px;color:${BRAND.muted};line-height:1.6;">
                  This notification was generated automatically from the
                  <a href="https://www.jurix.law" style="color:${BRAND.gold};text-decoration:none;">jurix.law</a> website.
                  Reply directly to this email to respond to the sender.
                </p>
                <p style="margin:10px 0 0;font-size:12px;color:${BRAND.muted};">&copy; ${new Date().getFullYear()} Jurix Legal Technologies Pvt. Ltd.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildContactEmail(data: {
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  subject?: string;
  message?: string;
}) {
  const subject = `Jurix — New Contact Enquiry${data.name ? ` from ${data.name}` : ''}${
    data.category ? ` (${data.category})` : ''
  }`;
  const html = baseTemplate({
    heading: 'New Contact Enquiry',
    intro: 'A visitor submitted the contact form on the Jurix website.',
    fields: [
      { label: 'Name', value: data.name },
      { label: 'Email', value: data.email },
      { label: 'Phone', value: data.phone },
      { label: 'Category', value: data.category },
      { label: 'Subject', value: data.subject },
      { label: 'Message', value: data.message },
    ],
  });
  return { subject, html };
}

export function buildDemoEmail(data: {
  name?: string;
  barCouncilNo?: string;
  email?: string;
  mobile?: string;
  city?: string;
  areaOfPractice?: string;
  preferredDateTime?: string;
}) {
  const subject = `Jurix — New Demo Request${data.name ? ` from ${data.name}` : ''}${
    data.city ? ` (${data.city})` : ''
  }`;
  const html = baseTemplate({
    heading: 'New Demo Request',
    intro: 'A lawyer requested a demo via the "Book a demo" form on the Jurix website.',
    fields: [
      { label: 'Name', value: data.name },
      { label: 'Bar Council Reg. No.', value: data.barCouncilNo },
      { label: 'Email', value: data.email },
      { label: 'Mobile', value: data.mobile },
      { label: 'City', value: data.city },
      { label: 'Area of Practice', value: data.areaOfPractice },
      { label: 'Preferred Date & Time', value: data.preferredDateTime },
    ],
  });
  return { subject, html };
}

/**
 * Sends an email via Brevo's transactional API.
 * Throws if BREVO_API_KEY is missing or the API responds with a non-2xx status.
 */
export async function sendEmail(opts: {
  subject: string;
  html: string;
  to?: string;
  replyTo?: { email: string; name?: string };
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  const payload: Record<string, unknown> = {
    sender: { email: FROM_EMAIL, name: FROM_NAME },
    to: [{ email: opts.to || NOTIFY_TO }],
    subject: opts.subject,
    htmlContent: opts.html,
  };

  if (opts.replyTo?.email) {
    payload.replyTo = { email: opts.replyTo.email, name: opts.replyTo.name || opts.replyTo.email };
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Brevo email failed (${res.status}): ${detail}`);
  }
}
