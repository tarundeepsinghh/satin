// Central brand + business configuration.
// TODO(owner): confirm every value marked TODO before launch.

export const site = {
  name: 'Satin by Sukhmani',
  shortName: 'Satin',
  designerName: 'Sukhmani Kaur',
  tagline: 'Hand-embroidered Indian couture, made to order.',
  description:
    'Satin by Sukhmani is the made-to-order label of designer Sukhmani Kaur — bridal lehengas, anarkalis, sharara sets, co-ords and sarees, finished with hand embroidery.',
  locale: 'en_IN',
  lang: 'en-IN',

  email: 'TODO@example.com', // TODO(owner)
  whatsappNumber: '910000000000', // TODO(owner): international format, digits only
  instagramUrl: 'https://www.instagram.com/', // TODO(owner): profile URL
  instagramHandle: undefined as string | undefined, // TODO(owner): e.g. '@satinbysukhmani'
  location: undefined as { city: string; region: string; country: string } | undefined,

  /** Show catalogue prices from the Shopify import ("From ₹15,000"). */
  showPrices: true,
  /** Design shown in the home hero. */
  heroDesign: 'gulnoor',
  defaultCustomisationNote: 'Sizes and colours can be customised on request — share your requirements when you enquire.',

  seo: {
    titleTemplate: '%s | Satin by Sukhmani',
    defaultTitle: 'Satin by Sukhmani — Hand-Embroidered Designer Indian Wear',
    defaultDescription:
      'Designer bridal lehengas, anarkalis, sharara sets and co-ords by Sukhmani Kaur. Hand-embroidered and made to order — enquire on WhatsApp or request a custom outfit.',
    twitterHandle: undefined as string | undefined,
  },

  nav: [
    { href: '/collections', label: 'Collections' },
    { href: '/custom-made', label: 'Custom Made' },
    { href: '/about', label: 'The Designer' },
    { href: '/contact', label: 'Contact' },
  ],
} as const;

// Hand techniques & fabrics that appear across the catalogue (used in the "Craft" section).
export const craft = ['Zari', 'Dabka', 'Resham', 'Katdana', 'Gotta Patti', 'Mirror Work', 'Hand Painting', 'Shibori', 'Sequins', 'Pearl Work'];

// Enquiry form options — TODO(owner): confirm categories & budget bands.
export const outfitCategories = [
  'Bridal wear',
  'Lehenga',
  'Anarkali / Sharara / Suit',
  'Co-ord / Indo-western',
  'Saree / Dupatta',
  'Something else',
] as const;

export const budgetRanges = [
  'Not sure yet',
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  'Above ₹1,00,000',
] as const;

export const contactMethods = ['WhatsApp', 'Email', 'Phone'] as const;

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
