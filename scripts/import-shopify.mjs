// Import a Shopify products CSV export into src/content/designs/*.md
// Usage: node scripts/import-shopify.mjs path/to/products_export.csv
// Also downloads every product photo into src/assets/designs/<slug>/ (existing files are skipped).
// Re-runnable: overwrites generated design files; hand edits to those files will be lost,
// so after launch prefer editing the .md files directly.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Source photos are normalised to 1600px wide, mozjpeg q82 (~300 KB). Astro makes the
// responsive WebP variants at build; this only keeps the repo and builds light.
const normalise = (buf) =>
  sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).flatten({ background: '#ffffff' }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();

const csvPath = process.argv[2];
if (!csvPath) throw new Error('Pass the CSV path');

// ---- minimal RFC4180 CSV parser ----
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

// Curated display names (poetic names from the Shopify titles). handle → [name, subtitle, slug?]
const curated = {
  'aasmaan-ice-blue-embroidered-pure-silk-sharara-suit': ['Aasmaan', 'Ice blue embroidered pure silk sharara suit', 'aasmaan'],
  'chand-organza-sheer-sharara-set': ['Chand', 'Deep red pure organza sharara set with chand buti', 'chand'],
  'meera-ivory-black-full-suit-with-embroidery': ['Meera', 'Ivory-black full suit with embroidery', 'meera'],
  'meethi-kurta-copy': ['Meethi Kurta — Blue', 'Hand-embroidered sleeveless kurta, festive co-ord', 'meethi-kurta-blue'],
  'meethi-pants': ['Meethi Pants', 'Embroidered cotton pants', 'meethi-pants'],
  '🌼-rani-🌼-georgette-satin-print-saree': ['Rani', 'Georgette satin print saree', 'rani'],
  '💎heera-💎-dark-lilac-cord-set-with-sleeves': ['Heera — Lilac', 'Dark lilac co-ord set with sleeves', 'heera-lilac'],
  '🌷aayat-hot-pink-anarkali-suit-for-weddings🌷': ['Aayat', 'Hot pink anarkali suit for weddings', 'aayat'],
  '🌷-mehek-🌷cord-set': ['Mehek', 'Embroidered festive co-ord set', 'mehek'],
  '🌼meher-lehenga-set🌼-copy': ['Meher — Yellow', 'Yellow full-sleeve lehenga set with gotta patti', 'meher-yellow'],
  '🌼meher-lehenga-set🌼': ['Meher — Ivory', 'Ivory lehenga set with gotta patti embroidery', 'meher-ivory'],
  '💎heera-💎-pants': ['Heera Pants', 'Embroidered cotton pants', 'heera-pants'],
  '💎heera-💎-kurta': ['Heera Kurta', 'Sleeveless co-ord kurta', 'heera-kurta'],
  '💎heera-💎': ['Heera', 'Sleeveless co-ord set', 'heera'],
  '🌷-gul🌷pants': ['Gul Pants', 'Embroidered cotton pants', 'gul-pants'],
  '🌷-gul🌷kurta': ['Gul Kurta', 'Strappy sleeveless co-ord kurta', 'gul-kurta'],
  'rehmat-choga-set': ['Rehmat', 'Hand-embroidered cotton choga set', 'rehmat'],
  '🌻-husna-🌻': ['Husna', 'Indo-western designer suit', 'husna'],
  '🌻-teekhii-🌻': ['Teekhii', 'Ivory embroidered bomber jacket', 'teekhii'],
  '🌹-neelam-🌹': ['Neelam', 'Designer sharara suit for cocktail & sangeet', 'neelam'],
  '🌷-rangini-🌷': ['Rangini', 'Tie and dye saree', 'rangini'],
  '🌻surangana-🌻': ['Surangana', 'Two-piece silk co-ord set', 'surangana'],
  '🌻riwaayat-🌻': ['Riwaayat', 'Semi-bridal anarkali', 'riwaayat'],
  '🌹-gulnoor-🌹': ['Gulnoor', 'Bridal outfit for the modern bride', 'gulnoor'],
  'bebo-sharara-suit-with-asymmetrical-hemline': ['Bebo', 'Hot pink asymmetric sharara suit with hand embroidery', 'bebo'],
  'flower-lehenga': ['Phool', 'Ivory lehenga with pastel pink blouse and floral jaal', 'flower-lehenga'],
  'jasmine-pure-chanderi-hand-painted-suit-with-handwork': ['Jasmine', 'Pure chanderi hand-painted suit with handwork', 'jasmine'],
  d: ['Navy Linen Co-ord', 'Relaxed linen co-ord with handwork flower motif', 'navy-linen-cord-set'],
  'black-asymmetrical-embroidered-handbag': ['Black Asymmetric Handbag', 'Hand-embroidered handbag'],
  'black-georgette-handembroidered-full-suit': ['Black Georgette Suit', 'Hand-embroidered full suit in georgette'],
  'black-georgette-patiala-suit-with-embroidered-dupatta': ['Black Patiala Suit', 'Georgette patiala suit with embroidered dupatta', 'black-patiala-suit'],
  'black-printed-georgette-anarkali-with-stonework': ['Black Printed Anarkali', 'Georgette anarkali with stonework'],
  'black-pure-silk-hand-embroidered-anarkali-with-cotton-silk-pants': ['Black Silk Anarkali', 'Hand-embroidered pure silk anarkali with cotton silk pants', 'black-silk-anarkali'],
  'blue-garden-handembroidered-shoulder-bag': ['Blue Garden Bag', 'Hand-embroidered shoulder bag'],
  'box-pleated-hand-embroidered-lehenga-in-pure-silk-mehendi-sangeet-functions': ['Box Pleated Lehenga', 'Hand-embroidered pure silk lehenga for mehendi & sangeet', 'box-pleated-silk-lehenga'],
  'bridal-tissue-anarkali-budget-friendly-embroidered-anarkali': ['Bridal Tissue Anarkali', 'Embroidered tissue anarkali', 'bridal-tissue-anarkali'],
  'designer-kaftan-hand-embroidered-tunic-in-mind-green-grey-festive-wear': ['Mint Grey Kaftan', 'Hand-embroidered kaftan tunic', 'mint-grey-kaftan'],
  'gold-pure-chanderi-silk-kaftan-with-black-banarasi-border': ['Gold Chanderi Kaftan', 'Pure chanderi silk kaftan with black Banarasi border', 'gold-chanderi-kaftan'],
  'green-embroidered-handbag-with-cute-hearts-embroidery': ['Green Hearts Handbag', 'Embroidered handbag with hearts', 'green-hearts-handbag'],
  'hot-pink-embroidered-handbag': ['Hot Pink Handbag', 'Embroidered handbag'],
  'hot-pink-oversized-shirt-for-women-linen-lycra-free-size-embroidered-sequin-shirt-trendy-travel-office-amp-festive-wear': ['Hot Pink Sequin Shirt', 'Oversized linen-lycra shirt with embroidery', 'hot-pink-sequin-shirt'],
  'ice-blue-hand-painted-pure-silk-suit-with-embroidery': ['Ice Blue Hand-Painted Suit', 'Pure silk suit with hand painting and embroidery', 'ice-blue-hand-painted-suit'],
  'ivory-kurta-with-multicolor-embroidery-mint-green-georgette-lehenga-with-baby-pink-dupatta-designer-festive-wedding-wear': ['Mint Lehenga Set', 'Ivory embroidered kurta, mint georgette lehenga, baby pink dupatta', 'mint-lehenga-set'],
  'ivory-pink-handembroidered-gharara-set-in-pure-georgette': ['Ivory Pink Gharara Set', 'Hand-embroidered gharara set in pure georgette', 'ivory-pink-gharara-set'],
  'multicoloured-designer-dupatta-with-handwork': ['Multicoloured Dupatta', 'Designer dupatta with handwork'],
  'nude-brown-ombre-embroidered-saree-in-georgette': ['Nude Ombre Saree', 'Embroidered georgette saree in nude-brown ombre', 'nude-ombre-saree'],
  'orange-georgette-cord-set-with-hand-embroidery-and-pearl-details-festive-and-wedding-wear': ['Orange Georgette Co-ord', 'Co-ord set with hand embroidery and pearl details', 'orange-georgette-coord'],
  'peach-pink-anarkali-with-mirror-work': ['Peach Pink Anarkali', 'Anarkali with mirror work'],
  'pink-hearts-embroidered-shoulder-bag': ['Pink Hearts Bag', 'Embroidered shoulder bag'],
  'pure-cotton-ivory-embroidered-dupatta-festive-gifting-essentials': ['Ivory Cotton Dupatta', 'Embroidered pure cotton dupatta', 'ivory-cotton-dupatta'],
  'pure-silk-shibori-work-ghadchola-dupatta': ['Shibori Silk Dupatta', 'Pure silk dupatta with shibori work', 'shibori-silk-dupatta'],
  'red-embroidered-handbag': ['Red Handbag', 'Embroidered handbag'],
  'wrap-around-cord-set-tunic-with-pants-for-festive-functions-and-weddings': ['Wrap Co-ord Set', 'Wrap-around tunic with pants for festive functions', 'wrap-coord-set'],
  'yellow-peplum-with-gharara-3-piece-set-with-hand-embroidery': ['Yellow Peplum Gharara', 'Three-piece peplum and gharara set with hand embroidery', 'yellow-peplum-gharara'],
};

const featured = ['🌹-gulnoor-🌹', '🌻riwaayat-🌻', '🌼meher-lehenga-set🌼', 'chand-organza-sheer-sharara-set', 'bebo-sharara-suit-with-asymmetrical-hemline', '🌹-neelam-🌹', 'jasmine-pure-chanderi-hand-painted-suit-with-handwork', '🌷aayat-hot-pink-anarkali-suit-for-weddings🌷', 'flower-lehenga', '💎heera-💎-dark-lilac-cord-set-with-sleeves'];
const skip = new Set(['test-product']);

const stripEmoji = (s) => s.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, ' ').replace(/\s+/g, ' ').trim();
const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;|&lsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/�/g, '–');
const sentenceCase = (s) => (s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s);
const slugify = (s) => stripEmoji(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function htmlToMd(html) {
  return stripEmoji(
    decode(html)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<li[^>]*>/gi, '\n- ')
      .replace(/<\/(p|div|h\d|ul|ol)>/gi, '\n\n')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim()).join('\n')
    .replace(/\n{3,}/g, '\n\n').trim();
}

function collectionFor(text) {
  const t = text.toLowerCase();
  if (/\bbags?\b|handbag/.test(t)) return 'embroidered-bags';
  if (/saree/.test(t)) return 'sarees-dupattas';
  if (/bridal|lehenga|gulnoor|riwaayat/.test(t)) return 'bridal-lehengas';
  if (/sharara|anarkali|suit|gharara|peplum|patiala/.test(t)) return 'festive-suits';
  if (/dupatta/.test(t)) return 'sarees-dupattas';
  return 'coords-indo-western';
}

// Long titles are cut only at a phrase boundary (never mid-phrase) to stay readable in results.
const seoTitle = (t) => (t.length > 80 ? t.split(/\s[|–]\s|,\s/)[0] : t);
const yaml = (s) => JSON.stringify(s); // JSON strings are valid YAML scalars

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const products = new Map();
for (const r of rows) {
  const p = products.get(r.Handle) ?? { handle: r.Handle, prices: new Set(), images: [] };
  if (r.Title) Object.assign(p, { title: r.Title, body: r['Body (HTML)'], status: r.Status, seoDescription: r['SEO Description'], fabric: r['Fabric (product.metafields.shopify.fabric)'] });
  if (Number(r['Variant Price']) > 0) p.prices.add(Number(r['Variant Price']));
  if (r['Image Src']) p.images.push({ url: r['Image Src'].split('?')[0], pos: Number(r['Image Position']) || 99, alt: r['Image Alt Text'] });
  products.set(r.Handle, p);
}

const outDir = 'src/content/designs';
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// Download size: Shopify CDN resizes on request. 2000px covers 1280px display at 1.5x density.
const DOWNLOAD_WIDTH = 2000;
const ASSET_DIR = 'src/assets/designs';
const downloads = [];

const redirects = {};
let count = 0;
for (const p of products.values()) {
  if (p.status !== 'active' || !p.images.length || skip.has(p.handle)) continue;
  const cleanTitle = sentenceCase(stripEmoji(decode(p.title)));
  const [name, subtitle, slug] = curated[p.handle] ?? [
    sentenceCase(cleanTitle.split(/\s[|–:]\s?|\s-\s|- (?=[A-Z])/)[0].replace(/[.\s]+$/, '')),
    undefined,
    undefined,
  ];
  const finalSlug = slug ?? slugify(p.handle);
  if (finalSlug !== p.handle) redirects[`/products/${encodeURIComponent(p.handle)}`] = `/designs/${finalSlug}`;

  const body = htmlToMd(p.body || '');
  const firstSentence = body.split('\n').find((l) => l && !l.startsWith('-'))?.split(/(?<=[.!])\s/)[0];
  const summary = subtitle ?? (firstSentence && firstSentence.length < 160 ? firstSentence : cleanTitle);
  const prices = [...p.prices].sort((a, b) => a - b);
  const images = p.images.sort((a, b) => a.pos - b.pos).map((img, i) => {
    // Photos are stored locally: src/assets/designs/<slug>/01.jpg (path is relative to the .md file).
    const file = `${String(i + 1).padStart(2, '0')}.jpg`; // everything (incl. HEIC/PNG) is stored as JPEG
    downloads.push({ url: `${img.url}?width=${DOWNLOAD_WIDTH}&format=jpg`, file: path.join(ASSET_DIR, finalSlug, file) });
    return { ...img, src: `../../assets/designs/${finalSlug}/${file}` };
  });
  const fi = featured.indexOf(p.handle);

  const fm = [
    '---',
    `name: ${yaml(name)}`,
    `collection: ${collectionFor(`${p.handle} ${cleanTitle}`)}`,
    `summary: ${yaml(summary)}`,
    'images:',
    ...images.map((img, i) => `  - src: ${yaml(img.src)}\n    alt: ${yaml(img.alt || `${name} — ${subtitle ?? cleanTitle}${i ? `, view ${i + 1}` : ''}`)}`),
    ...(prices.length ? [`price:\n  amount: ${prices[0]}\n  startingFrom: ${prices.length > 1}`] : []),
    ...(p.fabric ? [`materials: [${p.fabric.split(';').map((f) => yaml(f.trim())).join(', ')}]`] : []),
    `featured: ${fi >= 0}`,
    `order: ${fi >= 0 ? fi + 1 : 100 + count}`,
    'seo:',
    `  title: ${yaml(seoTitle(subtitle ? `${name.split(' — ')[0]} — ${subtitle}` : cleanTitle))}`,
    ...(p.seoDescription ? [`  description: ${yaml(stripEmoji(decode(p.seoDescription)).slice(0, 160))}`] : []),
    `shopifyHandle: ${yaml(p.handle)}`,
    '---',
    '',
    body || summary,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(outDir, `${finalSlug}.md`), fm);
  count++;
}

fs.writeFileSync('src/data/shopify-redirects.json', JSON.stringify(redirects, null, 2) + '\n');
console.log(`Imported ${count} designs, ${Object.keys(redirects).length} slug redirects.`);

// ---- download photos (skips files that already exist; 6 at a time) ----
let done = 0, skipped = 0, bytes = 0;
const failed = [];
async function worker() {
  for (let job = downloads.shift(); job; job = downloads.shift()) {
    if (fs.existsSync(job.file)) { skipped++; continue; }
    try {
      const res = await fetch(job.url);
      if (!res.ok || !res.headers.get('content-type')?.startsWith('image/')) throw new Error(`${res.status} ${res.headers.get('content-type')}`);
      const buf = await normalise(Buffer.from(await res.arrayBuffer()));
      fs.mkdirSync(path.dirname(job.file), { recursive: true });
      fs.writeFileSync(job.file, buf);
      bytes += buf.length; done++;
    } catch (e) {
      failed.push(`${job.file}: ${e.message}`);
    }
  }
}
const total = downloads.length;
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`Photos: ${done} downloaded (${(bytes / 1e6).toFixed(1)} MB), ${skipped} already present, ${failed.length} failed of ${total}.`);
if (failed.length) { console.error(failed.join('\n')); process.exitCode = 1; }
