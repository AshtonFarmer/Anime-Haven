import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'https://kagenexus.test/#access_token=test-only&refresh_token=test-only&type=recovery' });
const { window } = dom;
Object.assign(globalThis, {
  window, document: window.document, localStorage: window.localStorage,
  sessionStorage: window.sessionStorage, location: window.location,
  CustomEvent: window.CustomEvent,
  dispatchEvent: window.dispatchEvent.bind(window),
  __KAGENEXUS_CONFIG__: { supabaseUrl: 'https://project.supabase.co', supabasePublishableKey: 'sb_publishable_test' }
});
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });
window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };

const user = { id: 'phone-import-user', email: 'sample@example.com' };
let remoteRow = null;
let authCallback;
let updatedPassword;
const fakeClient = {
  auth: {
    onAuthStateChange(callback) {
      authCallback = callback;
      return { data: { subscription: { unsubscribe() {} } } };
    },
    async getSession() {
      authCallback('PASSWORD_RECOVERY', { user });
      return { data: { session: { user } }, error: null };
    },
    async updateUser({ password }) { updatedPassword = password; return { error: null }; }
  },
  from() {
    let payload;
    return {
      select() { return this; }, eq() { return this; },
      insert(value) { payload = value; return this; },
      update(value) { payload = value; return this; },
      async maybeSingle() {
        if (payload) remoteRow = structuredClone({ ...remoteRow, ...payload });
        return { data: structuredClone(remoteRow), error: null };
      },
      async single() { remoteRow = structuredClone(payload); return { data: remoteRow, error: null }; }
    };
  },
  channel() { return { on() { return this; }, subscribe() { return this; } }; },
  async removeChannel() {}
};
const cloud = await import('../src/cloud.js');
const account = await import('../src/account.js');
const store = await import('../src/store.js');
const settings = await import('../src/settings.js');
cloud.configureCloud({ createClient: () => fakeClient });

async function waitFor(condition) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (condition()) return;
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  throw new Error('Account action did not complete');
}

test('a recovery link opens the password form on a fresh device', async () => {
  assert.equal(cloud.hasStoredCloudSession(), false);
  await account.installAccounts();
  assert.ok(document.querySelector('#accountDialog').open);
  assert.ok(document.querySelector('#passwordRecoveryForm'));
  document.querySelector('#recoveryPassword').value = 'test-only-new-password';
  document.querySelector('#passwordRecoveryForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await waitFor(() => document.querySelector('#accountImportCode'));
  assert.equal(updatedPassword, 'test-only-new-password');
});

test('the account import button keeps the pasted KNX1 code through its busy render', async () => {
  const phone = store.makeInitialState();
  phone.profiles[0].items.push(store.normalizeItem({ id: 'private-phone-title', title: 'Private Phone Title 葬送', episode: 17 }));
  document.querySelector('#accountImportCode').value = settings.makeSyncCode(phone);
  document.querySelector('#accountImportCodeButton').click();
  await waitFor(() => remoteRow?.state.profiles[0].items.some(item => item.id === 'private-phone-title'));
  assert.equal(store.getStorageKey(), store.userStorageKey(user.id));
  assert.equal(remoteRow.state.profiles[0].items[0].episode, 17);
  assert.equal(localStorage.getItem(store.GUEST_STORAGE_KEY), null);
});

test.after(async () => { await cloud.destroyCloud(); dom.window.close(); });
