import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { ARSENAL_ITEMS } from '../src/data/arsenal-items.js';

const root = path.resolve(import.meta.dirname, '..');
const activeRoots = ['src', 'styles'];

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesBelow(full));
    else files.push(full);
  }
  return files;
}

const activeFiles = [
  path.join(root, 'index.html'),
  path.join(root, 'sw-core.js'),
  ...(
    await Promise.all(activeRoots.map(directory => filesBelow(path.join(root, directory))))
  ).flat()
];

for (const file of activeFiles.filter(file => /\.(?:html|js|css)$/.test(file))) {
  const source = await readFile(file, 'utf8');
  if (/\beval\s*\(/.test(source)) throw new Error(`Active eval found in ${path.relative(root, file)}`);
  if (/data\/(?:app|mobile-suite)\//.test(source)) throw new Error(`Encoded package reference found in ${path.relative(root, file)}`);
  if (/createElement\(['"]style['"]\)/.test(source) && file.includes(`${path.sep}src${path.sep}`)) {
    throw new Error(`Runtime style injection found in ${path.relative(root, file)}`);
  }
  if (/\bAshton\b/i.test(source)) throw new Error(`Personal profile data found in ${path.relative(root, file)}`);
}

const removedPersonalArtifacts = [
  'src/data/library-seed.js',
  'src/data/library-seed-release62.js',
  'legacy/release-62/arsenal-v34.js',
  'legacy/release-62/data/app/anime-haven-v4.part00',
  'legacy/release-62/data/mobile-suite/mobile-suite-v22.part00'
];
for (const relative of removedPersonalArtifacts) {
  try {
    await access(path.join(root, relative));
    throw new Error(`Personal legacy artifact still exists: ${relative}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const appSource = await readFile(path.join(root, 'src', 'app.js'), 'utf8');
if (/data\/library-seed/.test(appSource)) throw new Error('Personal library seed is still in the startup graph.');
if (/^import .*arsenal\.js/m.test(appSource)) throw new Error('Arsenal must remain a user-triggered dynamic import.');
const importPattern = /(?:from\s*|import\s*\()(['"])(\.{1,2}\/[^'"]+)\1/g;
for (const match of appSource.matchAll(importPattern)) {
  const resolved = path.resolve(root, 'src', match[2].split('?')[0]);
  await access(resolved);
}

const workerSource = await readFile(path.join(root, 'sw-core.js'), 'utf8');
if (/library-seed-release62|arsenal-items|vendor\/supabase/.test(workerSource)) {
  throw new Error('Deferred datasets and account SDKs must not be part of the first-install core cache.');
}
const cachedPaths = [...workerSource.matchAll(/['"]\.\/([^'"]+)['"]/g)]
  .map(match => match[1].split('?')[0])
  .filter(Boolean);
for (const relative of cachedPaths) await access(path.join(root, relative));

if (ARSENAL_ITEMS.length !== 1778 || new Set(ARSENAL_ITEMS.map(item => item.id)).size !== 1778) {
  throw new Error('Arsenal contract failed.');
}

console.log(JSON.stringify({
  core: '2.0.0-beta.2',
  startup: 'static ES modules',
  publicDefault: 'empty guest library',
  accountStorage: 'isolated per user',
  cloudSecurity: 'Supabase Auth + RLS',
  eval: 0,
  encodedRuntimePackages: 0,
  bundledPersonalLibraryItems: 0,
  arsenal: {
    total: ARSENAL_ITEMS.length,
    weapons: ARSENAL_ITEMS.filter(item => item.type === 'weapon').length,
    powers: ARSENAL_ITEMS.filter(item => item.type === 'power').length
  },
  activeFilesChecked: activeFiles.length
}, null, 2));
