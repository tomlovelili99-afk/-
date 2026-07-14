import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const assetsDir = join(root, 'public', 'assets');
const outputDir = join(assetsDir, 'optimized');
const mobileOutputDir = join(outputDir, 'mobile');
const compactOutputDir = join(outputDir, 'compact');
const variants = [
  { dir: outputDir, width: 1800, quality: 82, label: 'desktop' },
  { dir: mobileOutputDir, width: 720, quality: 68, label: 'mobile' },
  { dir: compactOutputDir, width: 480, quality: 62, label: 'compact' },
];
const imageExts = new Set(['.jpg', '.jpeg', '.png']);

variants.forEach(({ dir }) => mkdirSync(dir, { recursive: true }));

const optimize = async (source, output, variant) => {
  const sourceStats = statSync(source);
  if (statSync(output, { throwIfNoEntry: false })?.mtimeMs >= sourceStats.mtimeMs) {
    return false;
  }

  const image = sharp(source, { failOn: 'none' }).rotate();
  const metadata = await image.metadata();
  const shouldResize = metadata.width && metadata.width > variant.width;

  let pipeline = image;
  if (shouldResize) {
    pipeline = pipeline.resize({ width: variant.width, withoutEnlargement: true });
  }
  if (metadata.hasAlpha) {
    pipeline = pipeline.flatten({ background: '#f5f8ff' });
  }

  await pipeline.jpeg({
    quality: variant.quality,
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
  for (const variant of variants) {
    const output = join(variant.dir, `${name}.jpg`);
    if (await optimize(source, output, variant)) optimized += 1;
    else skipped += 1;
  }
}

console.log(`Optimized ${optimized} gallery asset variants to public/assets/optimized. Skipped ${skipped} unchanged variants.`);
