import { site } from '@/config/site';

/** wa.me link with a URL-encoded prefilled message. Opens only on user click. */
export const whatsappUrl = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const designEnquiryMessage = (designName: string, pageUrl: string) =>
  `Hi, I'm interested in the "${designName}" design I saw on your website: ${pageUrl}. Could you share more details?`;

export const followUpMessage = (reference: string) =>
  `Hi, I just submitted a custom outfit enquiry through your website. My enquiry reference is ${reference}. I'd like to discuss my design requirements.`;
