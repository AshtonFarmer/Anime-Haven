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
  dispatchEvent: window.dispatchEvent.bind(window),
  __KAGENEXUS_CONFIG__: {
    supabaseUrl: 'https://project.supabase.co',
    supabasePublishableKey: 'sb_publishable_test'
  }
});
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });

const remoteRows = new Map();
let authCallback = null;
const user = { id: 'user-123', email: 'sample@example.com', user_metadata: { display_name: 'Sample User' } };
const otherUser = { id: 'user-456', email: 'second@example.com' };
let queryGate = null;

function deferQuery(operation, userId) {
  let release;
  let entered;
  const reached = new Promise(resolve => { entered = resolve; });
  const waiting = new Promise(resolve => { release = resolve; });
  queryGate = { operation, userId, entered, waiting };
  return { reached, release };
}

function queryBuilder() {
  const query = { operation: 'select', filters: {}, payload: null };
  const builder = {
    select() { return builder; },
    eq(key, value) { query.filters[key] = value; return builder; },
    insert(payload) { query.operation = 'insert'; query.payload = payload; return builder; },
    update(payload) { query.operation = 'update'; query.payload = payload; return builder; },
    async maybeSingle() {
      const remoteRow = structuredClone(remoteRows.get(query.filters.user_id) || null);
      if (queryGate?.operation === query.operation && queryGate.userId === query.filters.user_id) {
        const gate = queryGate;
        queryGate = null;
        gate.entered();
        await gate.waiting;
      }
      if (query.operation === 'select') return { data: remoteRow, error: null };
      if (query.operation === 'update') {
        if (!remoteRow || Number(remoteRow.revision) !== Number(query.filters.revision)) return { data: null, error: null };
        const updated = { ...remoteRow, ...structuredClone(query.payload) };
        remoteRows.set(query.filters.user_id, updated);
        return { data: structuredClone(updated), error: null };
      }
      return { data: null, error: null };
    },
    async single() {
      if (query.operation !== 'insert') return { data: null, error: new Error('Unexpected operation') };
      const remoteRow = { ...structuredClone(query.payload) };
      remoteRows.set(query.payload.user_id, remoteRow);
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
  assert.equal(remoteRows.get(user.id).state.profiles[0].items.length, 0);
  const preservedGuest = JSON.parse(window.localStorage.getItem(store.GUEST_STORAGE_KEY));
  assert.equal(preservedGuest.profiles[0].items[0].title, 'Guest Only');
});

test('cloud updates use optimistic revisions and retain private item progress', async () => {
  const item = store.normalizeItem({ id: 'cloud-one', title: 'Cloud One', status: 'watching', episode: 4 });
  store.activeProfile().items.push(item);
  store.saveState('episode-plus');
  await cloud.syncCloudNow();

  const remoteRow = remoteRows.get(user.id);
  assert.equal(remoteRow.revision, 2);
  assert.equal(remoteRow.state.profiles[0].items[0].title, 'Cloud One');
  assert.equal(remoteRow.state.profiles[0].items[0].episode, 4);
});

test('edits made during a cloud write remain dirty and reach the next sync', async () => {
  let item = store.activeProfile().items.find(entry => entry.id === 'cloud-one');
  item.episode = 5;
  item.updatedAt = '2099-01-01T00:00:00.000Z';
  store.saveState('episode-plus');
  const gate = deferQuery('update', user.id);
  const syncing = cloud.syncCloudNow();
  await gate.reached;
  item.episode = 6;
  item.updatedAt = '2099-01-01T00:00:01.000Z';
  store.saveState('episode-plus');
  gate.release();
  await syncing;
  assert.equal(remoteRows.get(user.id).state.profiles[0].items[0].episode, 5);
  assert.equal(store.activeProfile().items[0].episode, 6);
  await cloud.syncCloudNow();
  assert.equal(remoteRows.get(user.id).state.profiles[0].items[0].episode, 6);
});

test('switching accounts during a request cannot apply the previous account response', async () => {
  const gate = deferQuery('select', user.id);
  const oldSync = cloud.syncCloudNow().catch(error => error);
  await gate.reached;
  authCallback('SIGNED_IN', { user: otherUser });
  await cloud.syncCloudNow();
  gate.release();
  assert.equal((await oldSync).code, 'CLOUD_SESSION_CHANGED');
  assert.equal(store.getStorageKey(), store.userStorageKey(otherUser.id));
  assert.equal(store.activeProfile().items.length, 0);
  assert.equal(remoteRows.get(otherUser.id).state.profiles[0].items.length, 0);
  assert.equal(cloud.getCloudSnapshot().status, 'synced');
});

test('sign-out invalidates an in-flight response and restores only the guest library', async () => {
  const gate = deferQuery('select', otherUser.id);
  const oldSync = cloud.syncCloudNow().catch(error => error);
  await gate.reached;
  await cloud.signOut();
  gate.release();
  assert.equal((await oldSync).code, 'CLOUD_SESSION_CHANGED');
  assert.equal(store.getStorageKey(), store.GUEST_STORAGE_KEY);
  assert.deepEqual(store.activeProfile().items.map(item => item.title), ['Guest Only']);
  assert.equal(cloud.getCloudSnapshot().status, 'guest');
});

test('offline account edits persist and synchronize on reconnect', async () => {
  authCallback('SIGNED_IN', { user });
  await cloud.syncCloudNow();
  Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
  store.activeProfile().items.push(store.normalizeItem({ id: 'offline-title', title: 'Offline Title' }));
  store.saveState('offline-edit');
  await assert.rejects(cloud.syncCloudNow(), /offline/);
  assert.equal(cloud.getCloudSnapshot().status, 'offline');
  assert.ok(JSON.parse(localStorage.getItem(store.userStorageKey(user.id))).profiles[0].items.some(item => item.id === 'offline-title'));
  Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true });
  window.dispatchEvent(new window.Event('online'));
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Reconnect did not sync')), 1500);
    const listener = () => {
      if (cloud.getCloudSnapshot().status !== 'synced') return;
      clearTimeout(timeout);
      window.removeEventListener('kagenexus-cloud-status', listener);
      resolve();
    };
    window.addEventListener('kagenexus-cloud-status', listener);
  });
  assert.ok(remoteRows.get(user.id).state.profiles[0].items.some(item => item.id === 'offline-title'));
});

test('email callbacks initialize accounts even without a stored session', () => {
  assert.equal(cloud.hasStoredCloudSession(), false);
  assert.equal(cloud.hasCloudAuthCallback(), false);
  window.history.replaceState({}, '', '/#access_token=test-only&refresh_token=test-only&type=recovery');
  assert.equal(cloud.hasCloudAuthCallback(), true);
  window.history.replaceState({}, '', '/?code=test-only');
  assert.equal(cloud.hasCloudAuthCallback(), true);
  window.history.replaceState({}, '', '/');
});

test.after(async () => {
  await cloud.destroyCloud();
  dom.window.close();
});
