import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const sources = ['src/main.jsx', 'src/styles.css', 'index.html'];
const assetPattern = /["'`](\/assets\/[^"'`)]+)["'`)]/g;
const missing = new Set();

for (const source of sources) {
  const content = readFileSync(join(root, source), 'utf8');
  for (const match of content.matchAll(assetPattern)) {
    const assetPath = match[1].split('?')[0];
    if (assetPath.includes('${')) continue;
    if (!existsSync(join(root, 'public', assetPath))) {
      missing.add(`${source}: ${assetPath}`);
    }
  }
}

if (missing.size > 0) {
  console.error('Missing public assets:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log('All referenced public assets exist.');
