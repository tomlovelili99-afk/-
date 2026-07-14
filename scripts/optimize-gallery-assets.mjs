import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const assetsDir = join(root, 'public', 'assets');
const outputDir = join(assetsDir, 'optimized');
const maxWidth = 1800;
const quality = 82;
const imageExts = new Set(['.jpg', '.jpeg', '.png']);

mkdirSync(outputDir, { recursive: true });

const getWidth = (path) => {
  const result = spawnSync('sips', ['-g', 'pixelWidth', path], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || `Could not inspect ${path}`);
  const match = result.stdout.match(/pixelWidth:\s*(\d+)/);
  return match ? Number(match[1]) : 0;
};

const convert = (source, output) => {
  const sourceStats = statSync(source);
  if (statSync(output, { throwIfNoEntry: false })?.mtimeMs >= sourceStats.mtimeMs) {
    return false;
  }

  const width = getWidth(source);
  const args = [];
  if (width > maxWidth) args.push('--resampleWidth', String(maxWidth));
  args.push('-s', 'format', 'jpeg', '-s', 'formatOptions', String(quality), source, '--out', output);
  const result = spawnSync('sips', args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || `Could not optimize ${source}`);
  return true;
};

let count = 0;
let skipped = 0;

for (const file of readdirSync(assetsDir)) {
  const source = join(assetsDir, file);
  if (!statSync(source).isFile()) continue;
  const ext = extname(file).toLowerCase();
  if (!imageExts.has(ext)) continue;

  const name = basename(file, ext);
  const output = join(outputDir, `${name}.jpg`);
  if (convert(source, output)) count += 1;
  else skipped += 1;
}

console.log(`Optimized ${count} gallery assets to public/assets/optimized. Skipped ${skipped} unchanged assets.`);
