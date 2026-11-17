import { z } from 'zod';
import { budgetRanges, contactMethods, outfitCategories } from '@/config/site';

const REQUIRED = 'This field is required';
const empty = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? undefined : v);

const text = (max: number) => z.string({ message: REQUIRED }).trim().max(max, `Please keep this under ${max} characters`);
const optionalText = (max: number) => z.preprocess(empty, text(max).optional());
const choice = <T extends readonly [string, ...string[]]>(values: T) => z.enum(values, { message: 'Please choose an option' });

export const enquirySchema = z.object({
  // Section A — customer
  name: text(100).min(2, 'Please enter your full name'),
  email: z.string({ message: REQUIRED }).trim().toLowerCase().pipe(z.email('Please enter a valid email address')),
  phone: text(20).regex(/^\+?[0-9\s\-()]{7,20}$/, 'Please enter a valid phone number'),
  location: optionalText(100),
  contactMethod: choice(contactMethods),

  // Section B — outfit
  category: choice(outfitCategories),
  occasion: text(120).min(2, 'Please tell us the occasion'),
  description: text(3000).min(10, 'Please describe the outfit you have in mind'),
  design: optionalText(150), // design name when coming from a design page
  colour: optionalText(120),
  fabric: optionalText(120),
  embellishment: optionalText(200),
  quantity: z.preprocess(empty, z.coerce.number().int().min(1).max(50).optional()).catch(undefined),
  customisation: optionalText(2000),

  // Section C — budget & timeline
  budget: z.preprocess(empty, choice(budgetRanges).optional()),
  eventDate: z.preprocess(empty, z.iso.date('Please choose a valid date').optional()),
  timeline: optionalText(500),

  // Section D — references (no uploads in V1)
  referenceUrl: z.preprocess(
    empty,
    z.url({ protocol: /^https?$/, message: 'Please enter a valid http(s) link' }).max(500).optional(),
  ),

  // Section E — consent (must be explicitly checked)
  consent: z.literal('on', { message: 'Please confirm you have read the privacy policy' }),

  // Honeypot — must stay empty
  website: z.string().max(0).optional(),
});

export type Enquiry = z.infer<typeof enquirySchema>;
