import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const output = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await filesBelow(full));
    else output.push(full);
  }
  return output;
}

test('active startup contains no eval, encoded package fetch, or runtime exact-text patching', async () => {
  const files = [path.join(root, 'index.html'), path.join(root, 'sw-core.js'), ...await filesBelow(path.join(root, 'src'))]
    .filter(file => /\.(?:html|js)$/.test(file));
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(source, /\beval\s*\(/, path.relative(root, file));
    assert.doesNotMatch(source, /data\/app\/anime-haven-v4\.part/, path.relative(root, file));
    assert.doesNotMatch(source, /data\/mobile-suite\/mobile-suite-v22\.part/, path.relative(root, file));
    assert.doesNotMatch(source, /Mobile stability patch did not match/, path.relative(root, file));
  }
});

test('index uses static modules and normal stylesheets', async () => {
  const index = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.match(index, /<script type="module" src="\.\/src\/app\.js/);
  for (const stylesheet of ['styles/core.css', 'styles/mobile.css', 'styles/runtime.css', 'arsenal-v34.css', 'luffy-search-v35.css']) {
    assert.ok(index.includes(stylesheet), stylesheet);
  }
  assert.doesNotMatch(index, /bootstrap-v4\.js|mobile-suite-loader-v22\.js/);
});

test('core source has the requested feature boundaries', async () => {
  for (const file of ['app.js', 'store.js', 'library.js', 'search.js', 'settings.js', 'arsenal.js', 'updates.js']) {
    await assert.doesNotReject(() => readFile(path.join(root, 'src', file), 'utf8'));
  }
});

test('active modules do not inject style elements', async () => {
  const files = await filesBelow(path.join(root, 'src'));
  for (const file of files.filter(file => file.endsWith('.js'))) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(source, /createElement\(['"]style['"]\)/, path.relative(root, file));
  }
});
