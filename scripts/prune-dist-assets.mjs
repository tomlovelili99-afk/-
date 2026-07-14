import { existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';

const root = process.cwd();
const distAssets = join(root, 'dist', 'assets');
const sources = ['src/main.jsx', 'src/styles.css', 'index.html', 'src/pdf-page-manifest.json'];
const referencedAssets = new Set();
const assetPattern = /["'`](\/assets\/[^"'`)]+)["'`)]/g;

for (const source of sources) {
  const content = readFileSync(join(root, source), 'utf8');
  for (const match of content.matchAll(assetPattern)) {
    const assetPath = match[1].split('?')[0];
    if (assetPath.includes('${')) continue;
    referencedAssets.add(assetPath.slice('/assets/'.length));
  }
}

const shouldKeep = (relativePath) => (
  relativePath.startsWith('optimized/')
  || relativePath.startsWith('pdf-pages/')
  || (referencedAssets.has(relativePath) && !hasOptimizedReplacement(relativePath))
  || relativePath.startsWith('index-')
);

const hasOptimizedReplacement = (relativePath) => {
  if (relativePath.includes('/')) return false;
  const ext = extname(relativePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return false;
  const optimizedName = `${basename(relativePath, ext)}.jpg`;
  return existsSync(join(distAssets, 'optimized', optimizedName));
};

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      walk(path);
      continue;
    }

    const rel = relative(distAssets, path);
    if (shouldKeep(rel)) continue;
    rmSync(path);
    removed += 1;
  }
};

let removed = 0;
walk(distAssets);
console.log(`Pruned ${removed} unreferenced dist assets.`);
