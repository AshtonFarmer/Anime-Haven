import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'https://kagenexus.test/' });
const { window } = dom;

window.matchMedia ||= () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
window.scrollTo = () => {};
window.requestAnimationFrame = callback => window.setTimeout(() => callback(Date.now()), 0);
window.cancelAnimationFrame = id => window.clearTimeout(id);
window.HTMLElement.prototype.scrollIntoView = () => {};
if (window.HTMLDialogElement) {
  window.HTMLDialogElement.prototype.showModal = function showModal() { this.setAttribute('open', ''); };
  window.HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new window.Event('close'));
  };
}

Object.assign(globalThis, {
  window,
  document: window.document,
  localStorage: window.localStorage,
  sessionStorage: window.sessionStorage,
  CustomEvent: window.CustomEvent,
  Event: window.Event,
  Element: window.Element,
  HTMLElement: window.HTMLElement,
  Document: window.Document,
  DocumentFragment: window.DocumentFragment,
  Node: window.Node,
  MutationObserver: window.MutationObserver,
  DOMParser: window.DOMParser,
  innerWidth: 1200,
  innerHeight: 800,
  scrollY: 0,
  requestAnimationFrame: window.requestAnimationFrame,
  cancelAnimationFrame: window.cancelAnimationFrame,
  dispatchEvent: window.dispatchEvent.bind(window),
  addEventListener: window.addEventListener.bind(window),
  removeEventListener: window.removeEventListener.bind(window),
  __KAGENEXUS_DISABLE_AUTO_START__: true
});
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });

const app = await import('../src/app.js');
const store = await import('../src/store.js');
const library = await import('../src/library.js');
const search = await import('../src/search.js');
const settings = await import('../src/settings.js');
const upNext = await import('../src/up-next.js');
const { ANIME_SEED } = await import('../src/data/library-seed.js');

app.bootstrapApp({ loadFeatures: false, setupAnimations: false });

function resetState() {
  store.replaceState(store.makeInitialState(), { save: true, reason: 'test-reset' });
  app.renderApp();
}

test('Home renders the complete existing library without changing the save key', () => {
  resetState();
  const profile = store.activeProfile();
  const watched = profile.items.filter(item => item.status !== 'planned');
  const planned = profile.items.filter(item => item.status === 'planned');
  assert.equal(profile.items.length, 198);
  assert.equal(ANIME_SEED.length, 195);
  assert.equal(document.querySelector('#homeView').classList.contains('active'), true);
  assert.equal(document.querySelector('#watchedCount').textContent, `${watched.length} titles`);
  assert.equal(document.querySelector('#plannedCount').textContent, `${planned.length} titles`);
  assert.ok(localStorage.getItem('anime-haven-state-v2'));
});

test('Archive and Unstarted routes render the correct title sets', () => {
  resetState();
  const profile = store.activeProfile();
  app.setView('watched');
  assert.equal(document.querySelector('#listView').classList.contains('active'), true);
  assert.equal(document.querySelectorAll('#animeGrid .anime-card').length, profile.items.filter(item => item.status !== 'planned').length);
  app.setView('planned');
  assert.equal(document.querySelector('#listTitle').textContent, 'Haven’t Started Yet');
  assert.equal(document.querySelectorAll('#animeGrid .anime-card').length, profile.items.filter(item => item.status === 'planned').length);
});

test('Settings renders performance and complete backup controls', () => {
  resetState();
  app.setView('settings');
  assert.equal(document.querySelector('#settingsView').classList.contains('active'), true);
  assert.ok(document.querySelector('#kn62PerformanceSettings'));
  assert.ok(document.querySelector('#knDataSyncPanel'));
  assert.equal(document.querySelectorAll('#knDataSyncPanel .kn-sync-grid button').length, 6);
});

test('Search shows saved results and accepts an empty AniList response', async () => {
  resetState();
  search.configureSearch({
    render: app.renderApp,
    fetchImpl: async () => ({
      ok: true,
      async json() { return { data: { Page: { media: [] } } }; }
    })
  });
  await search.runSearch('Arcane');
  assert.equal(document.querySelector('#searchView').classList.contains('active'), true);
  assert.match(document.querySelector('#searchSummary').textContent, /saved match/);
  assert.ok([...document.querySelectorAll('#searchResults h3')].some(node => node.textContent === 'Arcane'));
});

test('Up Next renders the three most recently updated watching titles', () => {
  resetState();
  const profile = store.activeProfile();
  const planned = profile.items.filter(item => item.status === 'planned').slice(0, 4);
  planned.forEach((item, index) => {
    item.status = 'watching';
    item.episode = index + 1;
    item.updatedAt = `2026-08-01T12:0${index}:00.000Z`;
  });
  store.saveState('test-up-next');
  app.setView('home');
  upNext.renderUpNext({ force: true });
  const buttons = [...document.querySelectorAll('#kn62UpNext .kn62-up-next-item')];
  assert.equal(buttons.length, 3);
  assert.equal(buttons[0].querySelector('strong').textContent, planned[3].title);
});

test('Progress updates persist without changing the state schema', () => {
  resetState();
  const item = store.activeProfile().items.find(entry => entry.status === 'planned' && entry.mediaType !== 'movie');
  library.addEpisode('ashton', item.id);
  assert.equal(item.status, 'watching');
  assert.equal(item.episode, 1);
  const saved = JSON.parse(localStorage.getItem(store.STORAGE_KEY));
  const savedItem = saved.profiles[0].items.find(entry => entry.id === item.id);
  assert.equal(saved.version, 2);
  assert.equal(savedItem.episode, 1);
});

test('Backup import merges the newest title progress and keeps a safety copy', () => {
  resetState();
  const current = store.getState();
  const incoming = structuredClone(current);
  const target = incoming.profiles[0].items[0];
  target.episode = 777;
  target.updatedAt = '2099-01-01T00:00:00.000Z';
  incoming.updatedAt = target.updatedAt;
  settings.importPayload({ app: 'KageNexus', schema: 1, state: incoming }, { reload: false });
  assert.equal(store.activeProfile().items[0].episode, 777);
  assert.ok(localStorage.getItem(settings.IMPORT_SAFETY_KEY));
});

test('Arsenal installs all 1,778 entries but initially renders only 96 cards', async () => {
  resetState();
  const { ARSENAL_ITEMS } = await import('../src/data/arsenal-items.js');
  const arsenal = await import('../src/arsenal.js');
  arsenal.installArsenal();
  app.setView('arsenal');
  await new Promise(resolve => window.setTimeout(resolve, 0));
  assert.equal(ARSENAL_ITEMS.length, 1778);
  assert.equal(ARSENAL_ITEMS.filter(item => item.type === 'weapon').length, 1766);
  assert.equal(ARSENAL_ITEMS.filter(item => item.type === 'power').length, 12);
  assert.equal(document.querySelector('#arsenalView').classList.contains('active'), true);
  assert.equal(document.querySelectorAll('#arsenalGrid .arsenal-card').length, 96);
  assert.match(document.querySelector('#arsenalLoadStatus').textContent, /Showing 96 of 1,778/);
});

test.after(() => {
  dom.window.close();
});
