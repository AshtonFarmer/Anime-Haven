import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://kagenexus.test/' });
const { window } = dom;
Object.assign(globalThis, {
  window,
  document: window.document,
  location: window.location,
  localStorage: window.localStorage,
  CustomEvent: window.CustomEvent,
  Event: window.Event,
  __KAGENEXUS_CONFIG__: {
    supabaseUrl: 'https://project.supabase.co',
    supabasePublishableKey: 'sb_publishable_test'
  }
});
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });

let remoteRow = null;
let authCallback = null;
const user = { id: 'user-123', email: 'sample@example.com', user_metadata: { display_name: 'Sample User' } };

function queryBuilder() {
  const query = { operation: 'select', filters: {}, payload: null };
  const builder = {
    select() { return builder; },
    eq(key, value) { query.filters[key] = value; return builder; },
    insert(payload) { query.operation = 'insert'; query.payload = payload; return builder; },
    update(payload) { query.operation = 'update'; query.payload = payload; return builder; },
    async maybeSingle() {
      if (query.operation === 'select') return { data: remoteRow, error: null };
      if (query.operation === 'update') {
        if (!remoteRow || Number(remoteRow.revision) !== Number(query.filters.revision)) return { data: null, error: null };
        remoteRow = { ...remoteRow, ...structuredClone(query.payload) };
        return { data: structuredClone(remoteRow), error: null };
      }
      return { data: null, error: null };
    },
    async single() {
      if (query.operation !== 'insert') return { data: null, error: new Error('Unexpected operation') };
      remoteRow = { ...structuredClone(query.payload) };
      return { data: structuredClone(remoteRow), error: null };
    }
  };
  return builder;
}

const fakeClient = {
  auth: {
    onAuthStateChange(callback) {
      authCallback = callback;
      return { data: { subscription: { unsubscribe() {} } } };
    },
    async getSession() { return { data: { session: { user } }, error: null }; },
    async signOut() { authCallback?.('SIGNED_OUT', null); return { error: null }; }
  },
  from() { return queryBuilder(); },
  channel() {
    return { on() { return this; }, subscribe() { return this; } };
  },
  async removeChannel() {}
};

const store = await import('../src/store.js');
const cloud = await import('../src/cloud.js');

test('sign-in uses an isolated account cache and never uploads guest progress', async () => {
  store.configureStore({
    storage: window.localStorage,
    storageKey: store.GUEST_STORAGE_KEY,
    profile: { id: 'guest', name: 'Guest' }
  });
  const guest = store.makeInitialState();
  guest.profiles[0].items.push(store.normalizeItem({ id: 'guest-only', title: 'Guest Only' }));
  store.replaceState(guest, { save: true, reason: 'guest-test' });

  cloud.configureCloud({ createClient: () => fakeClient, render() {} });
  await cloud.initCloud();

  assert.equal(store.getStorageKey(), store.userStorageKey(user.id));
  assert.equal(store.activeProfile().items.length, 0);
  assert.equal(remoteRow.state.profiles[0].items.length, 0);
  const preservedGuest = JSON.parse(window.localStorage.getItem(store.GUEST_STORAGE_KEY));
  assert.equal(preservedGuest.profiles[0].items[0].title, 'Guest Only');
});

test('cloud updates use optimistic revisions and retain private item progress', async () => {
  const item = store.normalizeItem({ id: 'cloud-one', title: 'Cloud One', status: 'watching', episode: 4 });
  store.activeProfile().items.push(item);
  store.saveState('episode-plus');
  await cloud.syncCloudNow();

  assert.equal(remoteRow.revision, 2);
  assert.equal(remoteRow.state.profiles[0].items[0].title, 'Cloud One');
  assert.equal(remoteRow.state.profiles[0].items[0].episode, 4);
});

test.after(async () => {
  await cloud.destroyCloud();
  dom.window.close();
});
