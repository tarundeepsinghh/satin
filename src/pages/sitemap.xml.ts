import type { APIRoute } from 'astro';
import { getCollections, getDesigns, isPublic, indexImage } from '@/lib/content';

// Hand-rolled sitemap (instead of @astrojs/sitemap) so we can: skip drafts,
// emit real <lastmod> only when known, and add Google image-sitemap entries.

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

type Entry = { path: string; lastmod?: Date; images?: { loc: string; title?: string }[] };

export const GET: APIRoute = async ({ site }) => {
  const base = site!;
  const staticPaths = ['/', '/collections', '/about', '/custom-made', '/contact', '/privacy-policy'];

  const collections = (await getCollections()).filter(isPublic);
  const designs = (await getDesigns()).filter(isPublic);

  const entries: Entry[] = [
    ...staticPaths.map((path) => ({ path })),
    ...collections.map((c) => ({ path: `/collections/${c.id}`, lastmod: c.data.updated })),
    ...(await Promise.all(
      designs.map(async (d) => ({
        path: `/designs/${d.id}`,
        lastmod: d.data.updated,
        images: await Promise.all(
          d.data.images.map(async (img) => ({
            loc: (await indexImage(img.src)).src,
            title: img.alt,
          })),
        ),
      })),
    )),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (e) => `<url><loc>${esc(new URL(e.path, base).href)}</loc>${e.lastmod ? `<lastmod>${e.lastmod.toISOString()}</lastmod>` : ''}${(e.images ?? [])
      .map((i) => `<image:image><image:loc>${esc(new URL(i.loc, base).href)}</image:loc></image:image>`)
      .join('')}</url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
