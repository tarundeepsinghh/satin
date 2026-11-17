import { getCollection, type CollectionEntry } from 'astro:content';

export type Collection = CollectionEntry<'collections'>;
export type Design = CollectionEntry<'designs'>;

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) =>
  a.data.order - b.data.order;

export async function getCollections() {
  return (await getCollection('collections')).sort(byOrder);
}

export async function getDesigns() {
  return (await getCollection('designs')).sort(byOrder);
}

export async function getDesignsInCollection(collectionId: string) {
  return (await getDesigns()).filter((d) => d.data.collection.id === collectionId);
}

export async function getRelatedDesigns(design: Design, limit = 4) {
  return (await getDesignsInCollection(design.data.collection.id))
    .filter((d) => d.id !== design.id)
    .slice(0, limit);
}

/** Entries that may appear in sitemap / llms.txt / be indexed. */
export const isPublic = (entry: { data: { draft: boolean } }) => !entry.data.draft;

type PhotoSrc = Design['data']['images'][number]['src'];
const srcOpts = (src: PhotoSrc) => ({ src, ...(typeof src === 'string' && { inferSize: true }), layout: 'none' as const });

/** 1200px JPEG — Open Graph / social previews (widest crawler support). */
export async function shareImage(src: PhotoSrc) {
  const { getImage } = await import('astro:assets');
  return getImage({ ...srcOpts(src), width: 1200, format: 'jpg' });
}

/** 1280px WebP — the gallery's largest variant, reused for JSON-LD and the image sitemap. */
export async function indexImage(src: PhotoSrc) {
  const { getImage } = await import('astro:assets');
  return getImage({ ...srcOpts(src), width: 1280, format: 'webp' });
}
