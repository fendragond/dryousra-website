import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const DIR = 'public/blog/images';
const MAX_WIDTH = 1000; // display width is ~768–880px; 1000 covers 1x comfortably
const QUALITY = 82;

const files = await readdir(DIR);
const pngs = files.filter((f) => f.toLowerCase().endsWith('.png'));
console.log(`Converting ${pngs.length} PNG files to WebP...\n`);

for (const f of pngs) {
  const src = path.join(DIR, f);
  const out = path.join(DIR, f.replace(/\.png$/i, '.webp'));
  const before = (await stat(src)).size;
  const meta = await sharp(src).metadata();
  const pipeline = sharp(src);
  if (meta.width > MAX_WIDTH) pipeline.resize({ width: MAX_WIDTH });
  await pipeline.webp({ quality: QUALITY }).toFile(out);
  const after = (await stat(out)).size;
  console.log(`${f}`);
  console.log(`  ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB  (${(100 - (after / before) * 100).toFixed(0)}% smaller)  ${meta.width}px → ${Math.min(meta.width, MAX_WIDTH)}px\n`);
}
console.log('Done. Originals kept — review WebP quality before deleting PNGs.');
