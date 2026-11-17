import type { APIRoute } from 'astro';
import { RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL } from 'astro:env/server';
import { Resend } from 'resend';
import { enquirySchema } from '@/lib/validation';
import { enquiryEmail } from '@/lib/email';

// The only server-rendered route; every page stays static.
export const prerender = false;

const MAX_BYTES = 20_000;

// TODO(deploy): add a Vercel WAF rate-limit rule for POST /api/custom-enquiries
// (e.g. 5 requests / 10 min per IP). In-memory limits don't work across serverless instances.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const makeReference = () => {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  return `GC-${ymd}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
};

export const POST: APIRoute = async ({ request }) => {
  const type = request.headers.get('content-type') ?? '';
  if (!type.includes('multipart/form-data') && !type.includes('application/x-www-form-urlencoded')) {
    return json({ ok: false, error: 'Unsupported content type' }, 415);
  }
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BYTES) {
    return json({ ok: false, error: 'Submission too large' }, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'Malformed submission' }, 400);
  }

  // Honeypot filled → pretend success, send nothing.
  if (form.get('website')) return json({ ok: true, reference: makeReference() });

  const parsed = enquirySchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      fieldErrors[key] ??= issue.message;
    }
    return json({ ok: false, error: 'Please check the highlighted fields', fieldErrors }, 422);
  }

  if (!RESEND_API_KEY || !ENQUIRY_TO_EMAIL || !ENQUIRY_FROM_EMAIL) {
    console.error('[enquiry] email env vars missing');
    return json({ ok: false, error: 'Enquiries are temporarily unavailable. Please contact us on WhatsApp.' }, 503);
  }

  const reference = makeReference();
  const { subject, html, text } = enquiryEmail(parsed.data, reference, new Date());

  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: ENQUIRY_FROM_EMAIL,
    to: ENQUIRY_TO_EMAIL,
    replyTo: parsed.data.email,
    subject,
    html,
    text,
  });

  if (error) {
    // Log only the provider error — never the customer's submission.
    console.error('[enquiry] resend error', reference, error.name);
    return json({ ok: false, error: 'We could not send your enquiry. Please try again or contact us on WhatsApp.' }, 502);
  }

  return json({ ok: true, reference });
};
