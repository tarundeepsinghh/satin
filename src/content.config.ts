import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per collection / design. The file name is the URL slug.
// Markdown body = long-form description (rendered on the page).
// `draft: true` → page still builds but is noindex and left out of sitemap/llms.txt.

const seo = z
  .object({
    title: z.string().max(100).optional(),
    description: z.string().max(170).optional(),
  })
  .optional();

const collectionEntries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/collections' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      summary: z.string(),
      cover: z.object({ src: z.union([z.url(), image()]), alt: z.string() }).optional(),
      numeral: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      draft: z.boolean().default(false),
      updated: z.coerce.date().optional(),
      seo,
    }),
});

const designEntries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/designs' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      collection: reference('collections'),
      summary: z.string(),
      // Local image (./photo.jpg, optimised at build) or remote URL (e.g. imported from Shopify CDN).
      images: z.array(z.object({ src: z.union([z.url(), image()]), alt: z.string() })).default([]),
      // Omit price entirely if unknown — never display invented amounts.
      price: z.object({ amount: z.number().positive(), startingFrom: z.boolean().default(true) }).optional(),
      availability: z.enum(['made-to-order', 'available', 'sold-out', 'archived']).default('made-to-order'),
      customisable: z.boolean().default(true),
      customisationNotes: z.string().optional(),
      materials: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      draft: z.boolean().default(false),
      updated: z.coerce.date().optional(),
      seo,
      shopifyHandle: z.string().optional(),
    }),
});

export const collections = { collections: collectionEntries, designs: designEntries };
