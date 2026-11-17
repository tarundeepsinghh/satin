// Art direction: which photo goes where. Each pick is [design slug, photo number (1-based)].
// Swap entries freely — the build fails loudly if a pick doesn't exist.
import { getEntry } from 'astro:content';

type Pick = readonly [slug: string, photo: number];

export const editorial = {
  hero: [['riwaayat', 3], ['gulnoor', 1], ['neelam', 3]], // middle = mobile hero + LCP
  atelier: ['teekhii', 1],
  inline: [['mehek', 2], ['riwaayat', 2], ['neelam', 1]], // tiny photos set inside the atelier headline
  craft: ['heera-lilac', 1],
  custom: ['mehek', 2],
  about: ['riwaayat', 4],
  lookbook: [
    ['mehek', 3], ['rehmat', 1], ['riwaayat', 5], ['neelam', 2], ['gul-kurta', 1], ['heera', 1],
    ['husna', 3], ['rangini', 1], ['surangana', 2], ['chand', 7], ['rani', 1], ['teekhii', 2],
  ],
} satisfies Record<string, Pick | readonly Pick[]>;

export async function pick([slug, photo]: Pick) {
  const design = await getEntry('designs', slug);
  const image = design?.data.images[photo - 1];
  if (!design || !image) throw new Error(`editorial pick not found: ${slug} #${photo}`);
  return { ...image, href: `/designs/${slug}`, name: design.data.name };
}

export const picks = (list: readonly Pick[]) => Promise.all(list.map(pick));
