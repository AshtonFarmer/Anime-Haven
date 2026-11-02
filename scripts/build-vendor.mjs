import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

const root = path.resolve(import.meta.dirname, '..');
await mkdir(path.join(root, 'vendor'), { recursive: true });

await build({
  entryPoints: [path.join(root, 'scripts/vendor/supabase-entry.js')],
  outfile: path.join(root, 'vendor/supabase.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['safari15.4', 'chrome100', 'firefox100'],
  minify: true,
  sourcemap: false,
  legalComments: 'none'
});
