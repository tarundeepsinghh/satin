# Satin by Sukhmani — website v2

The website for **Satin by Sukhmani**, the made-to-order label of designer Sukhmani Kaur: hand-embroidered bridal lehengas, anarkalis, sharara sets, co-ords, sarees and bags.

It is a designer portfolio and enquiry site, not a shop. Visitors browse the collections and then either enquire about a design on WhatsApp or send a custom-outfit enquiry through a form that emails the studio. v2 replaces the old Shopify store and the v1 "coming soon" page.

> **Status:** built, not hosted yet. Placeholder business details and some placeholder copy remain (see [Before launch](#before-launch)).

## Stack

- [Astro 7](https://astro.build): static pages, plus one server function for the enquiry form
- Tailwind CSS v4: brand tokens in `src/styles/global.css`
- Content collections: one Markdown file per design and per collection
- Resend: delivers enquiry emails
- Vercel: hosting target, via `@astrojs/vercel`
- Zod: form validation

No React or other client framework is used. The whole site ships about 7 KB of JavaScript.

## Getting started

Requires Node 22.12 or newer and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # production build → dist/
pnpm astro check  # type-check
```

Copy `.env.example` to `.env` to test the enquiry form locally:

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SITE_URL` | Production domain (no trailing slash). Used for canonical URLs, the sitemap and robots.txt. |
| `RESEND_API_KEY` | Resend API key (server only). |
| `ENQUIRY_TO_EMAIL` | Inbox that receives enquiries. |
| `ENQUIRY_FROM_EMAIL` | Sender address on a domain verified in Resend, e.g. `Satin by Sukhmani <enquiries@your-domain.com>`. |
| `NOINDEX` | Optional. Set to `true` to stop search engines indexing a build. |

Without the Resend variables, the form validates normally but answers "temporarily unavailable" instead of pretending to send.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: cover, atelier statement, collection chapters, lookbook, photo wall, craft, custom-made block |
| `/collections` | All collections |
| `/collections/[slug]` | One collection and its designs |
| `/designs/[slug]` | One design: gallery, price, WhatsApp enquiry, related designs |
| `/custom-made` | Custom-outfit enquiry form |
| `/about` | The designer |
| `/contact` | WhatsApp, Instagram, email |
| `/privacy-policy`, `/404` | |
| `POST /api/custom-enquiries` | The only server route: validates the form and emails it with Resend |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | Generated at build time |

Old Shopify URLs (`/products/…`, `/pages/…`) redirect to the new pages. Redirects for renamed products are listed in `src/data/shopify-redirects.json`.

## Project structure

```text
src/
  config/site.ts          brand name, contact details, nav, form options, price display
  config/editorial.ts     which photo appears where (hero, lookbook, photo wall…)
  content/collections/    one .md per collection (name, numeral, cover, description)
  content/designs/        one .md per design (name, collection, photos, price, description)
  assets/designs/<slug>/  product photos (01.jpg, 02.jpg…), optimised at build time
  components/             brand (logo, blossom), layout, ui, form, seo
  layouts/BaseLayout.astro
  lib/                    content helpers, SEO/JSON-LD, validation, email, WhatsApp links
  pages/                  routes (see above)
  styles/global.css       Tailwind v4 theme and brand utilities
public/brand/             logo kit as SVG (every lockup from the brand handoff)
scripts/
  import-shopify.mjs      Shopify CSV → design .md files + photo downloads + redirects
  build-brand.mjs         regenerates the logo kit, favicons and app icons
docs/                     content brief (Word) for the owner to fill in
```

## Editing content

**Add or edit a design.** Create or edit `src/content/designs/<slug>.md` and put its photos in `src/assets/designs/<slug>/`. The file name becomes the URL. Leave out `price` to show "Price on request". `draft: true` keeps a design out of search engines and the sitemap.

**Choose which photos appear where.** Edit the `[design, photo number]` picks in `src/config/editorial.ts`.

**Change business details and site text.** Most shared text and settings live in `src/config/site.ts`, including the WhatsApp number, email, Instagram link, tagline, form categories, budget ranges and the `showPrices` switch.

**Re-import from Shopify.** Running `node scripts/import-shopify.mjs path/to/products_export.csv` regenerates every design file. It overwrites manual edits, so after launch edit the Markdown files directly instead.

**Brand kit.** `node scripts/build-brand.mjs` rebuilds `public/brand/*.svg`, the favicons and the app icons from the logo geometry.

## SEO

- Canonical URLs, Open Graph and Twitter tags on every page
- JSON-LD structured data: Organization, WebSite, BreadcrumbList, CollectionPage and Product (with offers only when a price exists)
- Image sitemap covering every product photo
- `robots.txt` and `llms.txt`
- Non-production builds (Vercel previews) are automatically `noindex` and blocked in robots.txt

## Deploying (when ready)

1. Import the repo into Vercel. It detects Astro and the adapter automatically.
2. Add the environment variables above to the Production environment.
3. Verify the sending domain in Resend.
4. Add a Vercel Firewall rate-limit rule for `POST /api/custom-enquiries`.
5. Point the domain at Vercel and set `PUBLIC_SITE_URL` to it.

## Before launch

- [ ] Real WhatsApp number, email, Instagram link and domain in `src/config/site.ts`
- [ ] Final copy from the content brief (`docs/Satin Website Content Brief.docx`)
- [ ] Designer portrait and story for `/about`
- [ ] Confirm collection grouping, prices and budget ranges
- [ ] Review the privacy policy

## Windows notes

- `pnpm build` ends with an `EPERM … symlink` error from the Vercel adapter on Windows unless Developer Mode is enabled. The site itself builds fine, and Vercel builds on Linux are not affected.
- The Console Ninja VS Code extension has been seen overwriting `node_modules/astro/dist/cli/dev/index.js`, which makes `astro dev` fail with "dev is not a function". Fix it with `rm -rf node_modules && pnpm install`.
