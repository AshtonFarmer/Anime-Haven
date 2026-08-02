import assert from 'node:assert/strict';
import test from 'node:test';
import { ANIME_META, ANIME_SEED } from '../src/data/library-seed.js';
import { ARSENAL_ITEMS } from '../src/data/arsenal-items.js';
import { makeInitialState, migrateState, normalizeItem, STATE_VERSION, STORAGE_KEY } from '../src/store.js';
import { makeSyncCode, mergeStates, parseSyncCode, validatePayload } from '../src/settings.js';

test('Release 62 seed plus its existing v15 movie migration are preserved', () => {
  assert.equal(ANIME_META.seedCount, 195);
  assert.equal(ANIME_SEED.length, 195);
  assert.equal(new Set(ANIME_SEED.map(item => item.id)).size, 195);
  const state = makeInitialState();
  assert.equal(STORAGE_KEY, 'anime-haven-state-v2');
  assert.equal(state.version, STATE_VERSION);
  assert.equal(state.profiles[0].items.length, 198);
  assert.equal(state.libraryMigrationVersion, 15);
});

test('Arsenal data contract has 1,766 weapons, 12 powers, and no duplicate IDs', () => {
  assert.equal(ARSENAL_ITEMS.length, 1778);
  assert.equal(ARSENAL_ITEMS.filter(item => item.type === 'weapon').length, 1766);
  assert.equal(ARSENAL_ITEMS.filter(item => item.type === 'power').length, 12);
  assert.equal(new Set(ARSENAL_ITEMS.map(item => item.id)).size, 1778);
  for (const item of ARSENAL_ITEMS) {
    assert.ok(item.name);
    assert.ok(item.owner);
    assert.ok(item.anime);
    assert.ok(item.sourceUrl);
  }
});

test('Legacy anime-haven-state-v2 objects migrate without losing item progress', () => {
  const legacy = {
    version: 2,
    activeProfileId: 'another-profile',
    view: 'arsenal',
    listMode: 'planned',
    filter: 'completed',
    sort: 'recent',
    customFutureField: { keep: true },
    profiles: [{
      id: 'ashton',
      name: 'Ashton',
      items: [{ id: 'legacy-one', title: 'Legacy One', status: 'watching', season: 4, episode: 19, unknownItemField: 'kept' }]
    }],
    streak: { lastLogDate: '2026-07-31', days: 9 }
  };
  const migrated = migrateState(legacy);
  assert.equal(migrated.activeProfileId, 'ashton');
  assert.equal(migrated.view, 'arsenal');
  assert.equal(migrated.profiles[0].items[0].episode, 19);
  assert.equal(migrated.profiles[0].items[0].unknownItemField, 'kept');
  assert.deepEqual(migrated.customFutureField, { keep: true });
});

test('Backup merging chooses the newest progress title by title', () => {
  const current = makeInitialState([]);
  current.profiles[0].items = [normalizeItem({
    id: 'one', title: 'One', status: 'watching', episode: 5, updatedAt: '2026-07-01T00:00:00.000Z'
  })];
  const incoming = structuredClone(current);
  incoming.profiles[0].items[0].episode = 9;
  incoming.profiles[0].items[0].updatedAt = '2026-08-01T00:00:00.000Z';
  incoming.profiles[0].items.push(normalizeItem({ id: 'two', title: 'Two', status: 'planned' }));
  const merged = mergeStates(current, incoming);
  assert.equal(merged.profiles[0].items.find(item => item.id === 'one').episode, 9);
  assert.ok(merged.profiles[0].items.some(item => item.id === 'two'));
});

test('KNX1 sync codes round-trip Unicode titles and validate as backups', () => {
  const state = makeInitialState([]);
  state.profiles[0].items = [normalizeItem({ id: 'unicode', title: 'Frieren: Beyond Journey’s End 葬送', episode: 3 })];
  const code = makeSyncCode(state);
  assert.ok(code.startsWith('KNX1.'));
  const payload = parseSyncCode(code);
  const decoded = validatePayload(payload);
  assert.equal(decoded.profiles[0].items[0].title, state.profiles[0].items[0].title);
});
