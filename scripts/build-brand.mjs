// Generates the Satin by Sukhmani brand kit from the "Satin Logo v2" handoff geometry.
// Usage: node scripts/build-brand.mjs
// Outputs:
//   public/brand/*.svg  — every lockup (text embedded as Marcellus webfont, renders anywhere a browser does)
//   public/favicon.svg, favicon.ico, apple-touch-icon.png, icon-192/512.png, icon-maskable-512.png, logo.png

import fs from 'node:fs';
import sharp from 'sharp';

const C = {
  ink: '#4A2A33', rose: '#9C5E6D', pink: '#F7DAE2', pinkDeep: '#F2C8D3', blush: '#FBF4F6',
  plum: '#271820', onPlum: '#F4D2DB', onPlumMark: '#F2CFD9', onPlumMuted: '#C98E9C', frame: '#D8A9B6', line: '#E2D0D5',
};

const font = fs.readFileSync('node_modules/@fontsource/marcellus/files/marcellus-latin-400-normal.woff2').toString('base64');
const fontFace = `<style>@font-face{font-family:'Marcellus';src:url(data:font/woff2;base64,${font}) format('woff2')}text{font-family:'Marcellus',Georgia,serif;text-transform:uppercase}</style>`;

const PETAL = 'M0,0 C9,-17 9,-34 0,-47 C-9,-34 -9,-17 0,0 Z';
const ANGLES = [0, 72, 144, 216, 288];

/** Blossom centred at (cx, cy), rendered at `size` px (geometry lives in a 120-unit box). */
function blossom({ cx, cy, size, color, stroke = 2.2, veins = false, dot = 5.5 }) {
  const s = size / 120;
  const petals = ANGLES.map((a) => `<path transform="rotate(${a})" d="${PETAL}"/>`).join('');
  const v = veins ? ANGLES.map((a) => `<path transform="rotate(${a})" d="M0,-9 L0,-39" stroke-width="${stroke / 2}"/>`).join('') : '';
  return `<g transform="translate(${cx},${cy}) scale(${s})" stroke="${color}" stroke-width="${stroke}" stroke-linejoin="round" stroke-linecap="round" fill="none">${petals}${v}<circle r="${dot}" fill="${color}" stroke="none"/></g>`;
}

/** Tracked caps, optically centred (compensates the trailing letter-space like CSS text-indent). */
const text = ({ x, y, size, tracking, color, anchor = 'middle', value }) =>
  `<text x="${anchor === 'middle' ? x + (size * tracking) / 2 : x}" y="${y}" font-size="${size}" letter-spacing="${size * tracking}" fill="${color}" text-anchor="${anchor}">${value}</text>`;

const svg = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body.includes('<text') ? fontFace : ''}${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ''}${body}</svg>\n`;

// ── Lockups ───────────────────────────────────────────────────────────────
const primary = (tone, bg) => {
  const d = tone === 'dark';
  return svg(620, 360, [
    blossom({ cx: 310, cy: 99, size: 78, color: d ? C.onPlumMark : C.ink, veins: true }),
    text({ x: 310, y: 200, size: 46, tracking: 0.36, color: d ? C.onPlum : C.ink, value: 'Satin' }),
    text({ x: 310, y: 252, size: 13, tracking: 0.5, color: d ? C.onPlumMuted : C.rose, value: 'by Sukhmani' }),
  ].join(''), bg);
};

const horizontal = (tone, bg) => {
  const d = tone === 'dark';
  return svg(620, 240, [
    blossom({ cx: 190, cy: 120, size: 62, color: d ? C.onPlumMark : C.ink, stroke: 2.4 }),
    `<rect x="247" y="88" width="1" height="64" fill="${d ? C.onPlumMuted : C.line}"/>`,
    text({ x: 274, y: 127, size: 38, tracking: 0.3, color: d ? C.onPlum : C.ink, anchor: 'start', value: 'Satin' }),
    text({ x: 276, y: 152, size: 12, tracking: 0.42, color: d ? C.onPlumMuted : C.rose, anchor: 'start', value: 'by Sukhmani' }),
  ].join(''), bg);
};

const wordmark = (tone, bg) => {
  const d = tone === 'dark';
  return svg(620, 150, [
    text({ x: 310, y: 78, size: 40, tracking: 0.36, color: d ? C.onPlum : C.ink, value: 'Satin' }),
    text({ x: 310, y: 108, size: 12, tracking: 0.5, color: d ? C.onPlumMuted : C.rose, value: 'by Sukhmani' }),
  ].join(''), bg);
};

const files = {
  'logo-primary-light.svg': primary('light', C.pink),
  'logo-primary-dark.svg': primary('dark', C.plum),
  'logo-primary-ink.svg': primary('light'),
  'logo-primary-pink.svg': primary('dark'),
  'logo-horizontal-white.svg': horizontal('light', '#FFFFFF'),
  'logo-horizontal-ink.svg': horizontal('light'),
  'logo-horizontal-pink.svg': horizontal('dark'),
  'wordmark-light.svg': wordmark('light', C.pink),
  'wordmark-dark.svg': wordmark('dark', C.plum),
  'wordmark-ink.svg': wordmark('light'),

  // Marks
  'mark-blossom-ink.svg': svg(120, 120, blossom({ cx: 60, cy: 60, size: 120, color: C.ink, veins: true })),
  'mark-blossom-pink.svg': svg(120, 120, blossom({ cx: 60, cy: 60, size: 120, color: C.onPlumMark, veins: true })),
  'mark-badge.svg': svg(104, 104, `<circle cx="52" cy="52" r="52" fill="${C.pink}"/>${blossom({ cx: 52, cy: 52, size: 56, color: C.ink, stroke: 2.6 })}`),
  'mark-monogram.svg': svg(80, 110, `${blossom({ cx: 40, cy: 19, size: 34, color: C.rose, stroke: 3, dot: 6 })}${text({ x: 40, y: 98, size: 58, tracking: 0, color: C.ink, value: 'S' })}`),
  'mark-framed.svg': svg(104, 104, `<rect x="0.5" y="0.5" width="103" height="103" fill="none" stroke="${C.ink}"/><rect x="6.5" y="6.5" width="91" height="91" fill="none" stroke="${C.frame}"/>${blossom({ cx: 52, cy: 52, size: 50, color: C.ink, stroke: 2.6 })}`),

  // App icons
  'app-icon-ios.svg': svg(96, 96, `<rect width="96" height="96" rx="22" fill="${C.pinkDeep}"/>${blossom({ cx: 48, cy: 48, size: 52, color: C.ink, stroke: 2.8 })}`),
  'app-icon-round-dark.svg': svg(96, 96, `<circle cx="48" cy="48" r="48" fill="${C.plum}"/>${blossom({ cx: 48, cy: 48, size: 52, color: C.onPlumMark, stroke: 2.8 })}`),
  'favicon-48.svg': svg(48, 48, `<rect width="48" height="48" rx="11" fill="${C.pinkDeep}"/>${blossom({ cx: 24, cy: 24, size: 28, color: C.ink, stroke: 4, dot: 7 })}`),
  'favicon-28.svg': svg(28, 28, `<rect width="28" height="28" rx="7" fill="${C.pinkDeep}"/>${blossom({ cx: 14, cy: 14, size: 17, color: C.ink, stroke: 6, dot: 9 })}`),
};

fs.mkdirSync('public/brand', { recursive: true });
for (const [name, content] of Object.entries(files)) fs.writeFileSync(`public/brand/${name}`, content);

// ── Site icons (no text → rasterise cleanly) ──────────────────────────────
const square = (size, { radius = 0, pad = 0.23, stroke, dot } = {}) =>
  Buffer.from(svg(size, size, `<rect width="${size}" height="${size}" rx="${radius}" fill="${C.pinkDeep}"/>${blossom({ cx: size / 2, cy: size / 2, size: size * (1 - pad * 2), color: C.ink, stroke, dot })}`));

fs.copyFileSync('public/brand/favicon-28.svg', 'public/favicon.svg');
const png = (buf, out) => sharp(buf, { density: 300 }).png().toFile(out);
await png(square(180, { stroke: 2.8 }), 'public/apple-touch-icon.png'); // iOS applies its own mask
await png(square(192, { radius: 44, stroke: 2.8 }), 'public/icon-192.png');
await png(square(512, { radius: 118, stroke: 2.8 }), 'public/icon-512.png');
await png(square(512, { pad: 0.3, stroke: 2.8 }), 'public/icon-maskable-512.png');
await png(Buffer.from(svg(512, 512, `<circle cx="256" cy="256" r="256" fill="${C.pink}"/>${blossom({ cx: 256, cy: 256, size: 276, color: C.ink, stroke: 2.6 })}`)), 'public/logo.png');

// favicon.ico = ICO container with one 32px PNG entry
const ico32 = await sharp(Buffer.from(files['favicon-28.svg']), { density: 400 }).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(ico32.length, 14); header.writeUInt32LE(22, 18);
fs.writeFileSync('public/favicon.ico', Buffer.concat([header, ico32]));

console.log(`Brand kit: ${Object.keys(files).length} SVGs in public/brand, icons in public/`);
