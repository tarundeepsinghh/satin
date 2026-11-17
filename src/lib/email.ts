import type { Enquiry } from './validation';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function enquiryEmail(e: Enquiry, reference: string, submittedAt: Date) {
  const rows: [string, string | number | undefined][] = [
    ['Reference', reference],
    ['Submitted', submittedAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })],
    ['Name', e.name],
    ['Email', e.email],
    ['Phone / WhatsApp', e.phone],
    ['Preferred contact', e.contactMethod],
    ['Location', e.location],
    ['Category', e.category],
    ['Occasion', e.occasion],
    ['Inspired by design', e.design],
    ['Description', e.description],
    ['Colour', e.colour],
    ['Fabric', e.fabric],
    ['Embellishment', e.embellishment],
    ['Number of outfits', e.quantity],
    ['Budget', e.budget],
    ['Event date', e.eventDate],
    ['Timeline notes', e.timeline],
    ['Reference link', e.referenceUrl],
    ['Customisation notes', e.customisation],
  ];
  const filled = rows.filter(([, v]) => v !== undefined && v !== '');

  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#1a1a1a;max-width:640px;margin:0 auto;padding:16px">
<h2 style="margin:0 0 16px">New custom outfit enquiry</h2>
<table style="width:100%;border-collapse:collapse">${filled
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee;vertical-align:top;width:35%;color:#666">${k}</td><td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(String(v))}</td></tr>`,
    )
    .join('')}</table></body></html>`;

  const text = filled.map(([k, v]) => `${k}: ${v}`).join('\n');

  return { subject: `New Custom Outfit Enquiry — ${e.name.replace(/[\r\n]/g, ' ')}`, html, text };
}
