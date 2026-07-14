import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const assetsDir = join(root, 'public', 'assets');
const outputDir = join(assetsDir, 'optimized');
const maxWidth = 1800;
const quality = 82;
const imageExts = new Set(['.jpg', '.jpeg', '.png']);

mkdirSync(outputDir, { recursive: true });

const optimize = async (source, output) => {
  const sourceStats = statSync(source);
  if (statSync(output, { throwIfNoEntry: false })?.mtimeMs >= sourceStats.mtimeMs) {
    return false;
  }

  const image = sharp(source, { failOn: 'none' }).rotate();
  const metadata = await image.metadata();
  const shouldResize = metadata.width && metadata.width > maxWidth;

  let pipeline = image;
  if (shouldResize) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await pipeline.jpeg({
    quality,
    mozjpeg: true,
    progressive: true,
  }).toFile(output);

  return true;
};

let optimized = 0;
let skipped = 0;

for (const file of readdirSync(assetsDir)) {
  const source = join(assetsDir, file);
  if (!statSync(source).isFile()) continue;

  const ext = extname(file).toLowerCase();
  if (!imageExts.has(ext)) continue;

  const name = basename(file, ext);
  const output = join(outputDir, `${name}.jpg`);
  if (await optimize(source, output)) optimized += 1;
  else skipped += 1;
}

console.log(`Optimized ${optimized} gallery assets to public/assets/optimized. Skipped ${skipped} unchanged assets.`);
