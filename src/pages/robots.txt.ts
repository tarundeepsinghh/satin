import type { APIRoute } from 'astro';
import { isIndexable } from '@/lib/indexing';

export const GET: APIRoute = ({ site }) => {
  const body = isIndexable
    ? `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`
    : `User-agent: *\nDisallow: /\n`; // preview / non-production builds

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
