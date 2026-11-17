import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { getCollections, getDesigns, isPublic } from '@/lib/content';

// llms.txt (llmstxt.org): a plain-text map of the site for AI assistants / answer engines.
export const GET: APIRoute = async ({ site: base }) => {
  const url = (p: string) => new URL(p, base).href;
  const collections = (await getCollections()).filter(isPublic);
  const designs = (await getDesigns()).filter(isPublic);

  const body = `# ${site.name}

> ${site.description}

Designs are made to order. Enquiries: ${url('/custom-made')} or WhatsApp. No online checkout.

## Pages
- [About the Designer](${url('/about')})
- [Custom-Made Outfits](${url('/custom-made')})
- [Contact](${url('/contact')})

## Collections
${collections.map((c) => `- [${c.data.name}](${url(`/collections/${c.id}`)}): ${c.data.summary}`).join('\n')}

## Designs
${designs.map((d) => `- [${d.data.name}](${url(`/designs/${d.id}`)}): ${d.data.summary}`).join('\n')}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
