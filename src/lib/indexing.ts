// Server/build-only. Indexing guard: only the real production deployment may be indexed.
// Vercel sets VERCEL_ENV at build time; previews get noindex + Disallow.
export const isIndexable =
  (process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : import.meta.env.PROD) &&
  process.env.NOINDEX !== 'true';
