import { site } from '@/config/site';

/** Absolute URL on the production domain (never a preview URL). */
export const absoluteUrl = (path: string, base: URL | string) => new URL(path, base).href;

export const formatTitle = (title?: string) =>
  title ? site.seo.titleTemplate.replace('%s', title) : site.seo.defaultTitle;

type Crumb = { name: string; path: string };

// ---------- JSON-LD builders (schema.org) ----------
// Only real data goes in here: no ratings, reviews, addresses or prices unless they exist.

export function organizationLd(base: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization', base),
    name: site.name,
    url: absoluteUrl('/', base),
    logo: absoluteUrl('/logo.png', base),
    email: site.email,
    sameAs: [site.instagramUrl],
    ...(site.location && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.location.city,
        addressRegion: site.location.region,
        addressCountry: site.location.country,
      },
    }),
  };
}

export function websiteLd(base: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website', base),
    name: site.name,
    url: absoluteUrl('/', base),
    inLanguage: site.lang,
    publisher: { '@id': absoluteUrl('/#organization', base) },
  };
}

export function breadcrumbLd(crumbs: Crumb[], base: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path, base),
    })),
  };
}

export function collectionPageLd(
  opts: { name: string; description: string; path: string; items: { name: string; path: string }[] },
  base: URL,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path, base),
    isPartOf: { '@id': absoluteUrl('/#website', base) },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(item.path, base),
        name: item.name,
      })),
    },
  };
}

export function designLd(
  opts: {
    name: string;
    description: string;
    path: string;
    images: string[];
    category: string;
    price?: { amount: number };
    availability: string;
  },
  base: URL,
) {
  const availabilityMap: Record<string, string> = {
    'made-to-order': 'https://schema.org/PreOrder',
    available: 'https://schema.org/InStock',
    'sold-out': 'https://schema.org/SoldOut',
    archived: 'https://schema.org/Discontinued',
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path, base),
    image: opts.images,
    category: opts.category,
    brand: { '@type': 'Brand', name: site.name },
    // Offers only when a real price exists (required for merchant rich results).
    ...(opts.price && {
      offers: {
        '@type': 'Offer',
        price: opts.price.amount,
        priceCurrency: 'INR',
        availability: availabilityMap[opts.availability],
        url: absoluteUrl(opts.path, base),
      },
    }),
  };
}
