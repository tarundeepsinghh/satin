// Provider-agnostic analytics hooks. No provider is loaded yet.
// Events: collection_view, design_view, whatsapp_click, instagram_click,
//         design_card_click, enquiry_submitted (only after the API confirms success).
// To wire a provider later, add its snippet and it will pick events up via
// window.plausible / window.gtag, or listen for the `satin:track` DOM event.
// Never put personal enquiry details into event props.

type Props = Record<string, string | undefined>;

declare global {
  interface Window {
    plausible?: (name: string, opts?: { props?: Props }) => void;
    gtag?: (cmd: 'event', name: string, props?: Props) => void;
  }
}

export function track(name: string, props: Props = {}) {
  window.dispatchEvent(new CustomEvent('satin:track', { detail: { name, props } }));
  window.plausible?.(name, { props });
  window.gtag?.('event', name, props);
  if (import.meta.env.DEV) console.debug('[track]', name, props);
}

// Declarative click tracking: <a data-track="whatsapp_click" data-location="header">
document.addEventListener('click', (e) => {
  const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
  if (!el) return;
  const { track: name, ...props } = el.dataset;
  if (name) track(name, props);
});

// Page-level events from <body data-page-event='{"name":"design_view",...}'>
const pageEvent = document.body.dataset.pageEvent;
if (pageEvent) {
  const { name, ...props } = JSON.parse(pageEvent) as Props & { name: string };
  track(name, props);
}
