/**
 * Generate Nautila OG share images (1200×630) — warm paper, charcoal spiral, wordmark, tagline.
 * Run: node scripts/gen-og.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../public');

const spiral =
  'M100 0 A100 100 0 0 1 0 100 A61.8 61.8 0 0 1 -61.8 38.2 A38.2 38.2 0 0 1 -23.61 0 A23.61 23.61 0 0 1 0 23.61 A14.59 14.59 0 0 1 -14.59 38.2';

function svgFor(tagline) {
  // Escape XML for FR apostrophes / special chars already in plain text
  const safe = tagline
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F7F4EB"/>
      <stop offset="55%" stop-color="#F2EFE6"/>
      <stop offset="100%" stop-color="#E8E4D6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#wash)"/>
  <!-- soft teal wash corner -->
  <circle cx="1180" cy="-40" r="320" fill="#63A6A0" opacity="0.10"/>
  <circle cx="-40" cy="680" r="280" fill="#14333B" opacity="0.05"/>
  <!-- charcoal spiral mark -->
  <g transform="translate(780, 140) scale(2.85)" fill="none" stroke="#14333B" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.88">
    <path d="${spiral}"/>
  </g>
  <!-- wordmark -->
  <text x="88" y="268" font-family="Jost, 'Segoe UI', Helvetica, sans-serif" font-size="92" font-weight="500" fill="#14333B" letter-spacing="0.04em">Nautila</text>
  <!-- tagline -->
  <text x="88" y="350" font-family="'IBM Plex Sans', 'Segoe UI', Helvetica, sans-serif" font-size="36" font-weight="400" fill="#2c4a52">${safe}</text>
  <!-- thin accent rule -->
  <rect x="88" y="392" width="64" height="3" rx="1.5" fill="#2E7D8C"/>
  <!-- domain hint -->
  <text x="88" y="560" font-family="'IBM Plex Sans', 'Segoe UI', Helvetica, sans-serif" font-size="22" font-weight="500" fill="#7d9296" letter-spacing="0.22em">NAUTILA.MA</text>
</svg>`;
}

const locales = [
  { file: 'og-fr.png', tagline: 'Vos biens, parfaitement protégés' },
  { file: 'og-en.png', tagline: 'Your homes, perfectly protected' },
];

for (const { file, tagline } of locales) {
  const svg = Buffer.from(svgFor(tagline));
  const png = await sharp(svg).png({ quality: 92, compressionLevel: 8 }).toBuffer();
  const path = join(outDir, file);
  writeFileSync(path, png);
  console.log('wrote', path, `(${png.length} bytes)`);
}
