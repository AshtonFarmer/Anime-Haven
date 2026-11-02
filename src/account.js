import {
  getCloudSnapshot,
  initCloud,
  requestPasswordReset,
  signIn,
  signOut,
  signUp,
  syncCloudNow,
  updatePassword
} from './cloud.js';
import { hasLegacyState } from './store.js';
import { importLegacyDeviceData, importPayload, parseSyncCode } from './settings.js';
import { $, escapeHtml, showToast } from './utils.js';

let authMode = 'signin';
let recoveryMode = false;
let busy = false;
let renderApp = () => {};

function openDialog() {
  const dialog = $('#accountDialog');
  if (!dialog) return;
  renderAccountDialog();
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  window.setTimeout(() => dialog.querySelector('input:not([type="hidden"]),textarea')?.focus(), 80);
}

function closeDialog() {
  const dialog = $('#accountDialog');
  if (!dialog) return;
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

function statusLabel(snapshot) {
  if (!snapshot.configured) return 'Cloud setup is not connected yet.';
  if (snapshot.status === 'syncing') return 'Synchronizing now…';
  if (snapshot.status === 'offline') return 'Offline — changes are safe and waiting to sync.';
  if (snapshot.status === 'error') return snapshot.lastError || 'Cloud sync needs attention.';
  if (snapshot.lastSyncedAt) return `Last synchronized ${new Date(snapshot.lastSyncedAt).toLocaleString()}.`;
  return 'Private cloud sync is ready.';
}

export function renderAccountDialog() {
  const root = $('#accountContent');
  if (!root) return false;
  const snapshot = getCloudSnapshot();

  if (recoveryMode) {
    root.innerHTML = `<div class="account-kicker">ACCOUNT RECOVERY</div><h2>Choose a new password</h2>
      <p class="account-copy">Use at least 8 characters. Your other account data will stay unchanged.</p>
      <form id="passwordRecoveryForm" class="account-form">
        <label>New password<input id="recoveryPassword" type="password" minlength="8" autocomplete="new-password" required></label>
        <button class="action-button" type="submit" ${busy ? 'disabled' : ''}>${busy ? 'SAVING…' : 'SAVE NEW PASSWORD'}</button>
      </form>`;
    return true;
  }

  if (snapshot.user) {
    root.innerHTML = `<div class="account-kicker">PRIVATE KAGENEXUS ACCOUNT</div><h2>${escapeHtml(snapshot.user.email)}</h2>
      <p class="account-copy">${escapeHtml(statusLabel(snapshot))}</p>
      <div class="account-status ${snapshot.status === 'error' ? 'error' : ''}"><i></i><span>${escapeHtml(snapshot.status.toUpperCase())}</span></div>
      <div class="account-actions">
        <button id="accountSyncNow" class="action-button" type="button" ${busy ? 'disabled' : ''}>SYNC NOW</button>
        <button id="accountSignOut" class="action-button secondary" type="button" ${busy ? 'disabled' : ''}>SIGN OUT</button>
      </div>
      <section class="account-migration">
        <p>MOVE YOUR RELEASE 62 LIBRARY</p><h3>Import your private phone data</h3>
        <span>Paste the KNX1 code copied from the old KageNexus Settings screen. It will merge into this account and upload privately.</span>
        <textarea id="accountImportCode" placeholder="Paste your KNX1 import code"></textarea>
        <button id="accountImportCodeButton" class="action-button" type="button" ${busy ? 'disabled' : ''}>IMPORT CODE TO THIS ACCOUNT</button>
        <button id="accountMoveLegacy" class="account-text-button" type="button" ${hasLegacyState() ? '' : 'disabled'}>MOVE OLD DATA FOUND ON THIS WEB ADDRESS</button>
      </section>`;
    return true;
  }

  const creating = authMode === 'create';
  root.innerHTML = `<div class="account-kicker">YOUR PRIVATE NEXUS</div><h2>${creating ? 'Create an account' : 'Welcome back'}</h2>
    <p class="account-copy">${escapeHtml(statusLabel(snapshot))} Guest progress stays on this device and is never mixed into another account automatically.</p>
    <div class="account-tabs" role="tablist">
      <button type="button" data-auth-mode="signin" class="${creating ? '' : 'active'}">SIGN IN</button>
      <button type="button" data-auth-mode="create" class="${creating ? 'active' : ''}">CREATE ACCOUNT</button>
    </div>
    <form id="accountAuthForm" class="account-form">
      ${creating ? '<label>Display name<input id="accountDisplayName" type="text" maxlength="60" autocomplete="nickname" placeholder="Anime Fan"></label>' : ''}
      <label>Email<input id="accountEmail" type="email" autocomplete="email" required></label>
      <label>Password<input id="accountPassword" type="password" minlength="8" autocomplete="${creating ? 'new-password' : 'current-password'}" required></label>
      <button class="action-button" type="submit" ${busy || !snapshot.configured ? 'disabled' : ''}>${busy ? 'WORKING…' : creating ? 'CREATE PRIVATE ACCOUNT' : 'SIGN IN'}</button>
      ${creating ? '<small>Supabase will email you a confirmation link before the first sign-in.</small>' : '<button id="forgotPassword" class="account-text-button" type="button">FORGOT PASSWORD?</button>'}
    </form>`;
  return true;
}

async function withBusy(task) {
  if (busy) return;
  busy = true;
  renderAccountDialog();
  try {
    await task();
  } finally {
    busy = false;
    renderAccountDialog();
  }
}

async function importCodeToAccount() {
  const input = $('#accountImportCode');
  const code = input?.value || '';
  importPayload(parseSyncCode(code), { reload: false });
  renderApp();
  await syncCloudNow();
  if (input) input.value = '';
  showToast('Your phone library is now inside this private account.', 'success');
}

function bindAccountEvents() {
  if (document.documentElement.dataset.knAccountBound) return;
  document.documentElement.dataset.knAccountBound = '1';
  $('#accountButton')?.addEventListener('click', openDialog);
  $('#openAccount')?.addEventListener('click', openDialog);
  $('#accountDialog .account-close')?.addEventListener('click', closeDialog);
  $('#accountDialog')?.addEventListener('click', event => {
    const dialog = $('#accountDialog');
    if (event.target === dialog) closeDialog();
  });

  $('#accountContent')?.addEventListener('click', event => {
    const mode = event.target.closest('[data-auth-mode]')?.dataset.authMode;
    if (mode) {
      authMode = mode;
      renderAccountDialog();
      return;
    }
    if (event.target.closest('#accountSyncNow')) {
      withBusy(async () => {
        await syncCloudNow();
        showToast('Your account is synchronized.', 'success');
      }).catch(error => showToast(error.message || 'Cloud sync could not finish.', 'error'));
    } else if (event.target.closest('#accountSignOut')) {
      withBusy(async () => {
        await signOut();
        closeDialog();
        showToast('Signed out. Guest mode is now active.');
      }).catch(error => showToast(error.message || 'Sign out could not finish.', 'error'));
    } else if (event.target.closest('#accountImportCodeButton')) {
      withBusy(importCodeToAccount).catch(error => showToast(error.message || 'That code could not be imported.', 'error'));
    } else if (event.target.closest('#accountMoveLegacy')) {
      withBusy(async () => {
        importLegacyDeviceData({ reload: false });
        renderApp();
        await syncCloudNow();
        showToast('Your old device library is now inside this private account.', 'success');
      }).catch(error => showToast(error.message || 'Old device data could not be moved.', 'error'));
    } else if (event.target.closest('#forgotPassword')) {
      const email = $('#accountEmail')?.value?.trim();
      if (!email) {
        showToast('Enter your email first, then tap Forgot password.', 'error');
        return;
      }
      withBusy(async () => {
        await requestPasswordReset(email);
        showToast('Password reset email sent.', 'success');
      }).catch(error => showToast(error.message || 'Reset email could not be sent.', 'error'));
    }
  });

  $('#accountContent')?.addEventListener('submit', event => {
    event.preventDefault();
    if (event.target.id === 'passwordRecoveryForm') {
      const password = $('#recoveryPassword')?.value || '';
      withBusy(async () => {
        await updatePassword(password);
        recoveryMode = false;
        showToast('Your password was updated.', 'success');
      }).catch(error => showToast(error.message || 'Password could not be updated.', 'error'));
      return;
    }
    if (event.target.id !== 'accountAuthForm') return;
    const email = $('#accountEmail')?.value || '';
    const password = $('#accountPassword')?.value || '';
    const displayName = $('#accountDisplayName')?.value || '';
    withBusy(async () => {
      if (authMode === 'create') {
        const data = await signUp({ email, password, displayName });
        if (!data.session) showToast('Check your email and tap the confirmation link, then sign in.', 'success');
      } else {
        await signIn({ email, password });
        closeDialog();
        showToast('Signed in. Your private library is synchronizing.', 'success');
      }
    }).catch(error => showToast(error.message || 'Account request could not finish.', 'error'));
  });

  window.addEventListener('kagenexus-cloud-status', () => {
    renderAccountDialog();
    const button = $('#accountButton');
    const snapshot = getCloudSnapshot();
    button?.classList.toggle('is-signed-in', Boolean(snapshot.user));
    if (button) button.setAttribute('aria-label', snapshot.user ? `Account for ${snapshot.user.email}` : 'Open account');
  });
  window.addEventListener('kagenexus-auth-event', event => {
    if (event.detail?.event !== 'PASSWORD_RECOVERY') return;
    recoveryMode = true;
    openDialog();
  });
}

export async function installAccounts({ render } = {}) {
  if (render) renderApp = render;
  bindAccountEvents();
  renderAccountDialog();
  const start = async () => {
    try {
      await initCloud({ render: renderApp });
    } catch (error) {
      console.error('KageNexus account setup could not start', error);
      showToast('Account sync is temporarily unavailable. Guest mode still works.', 'error');
    }
  };
  if ('requestIdleCallback' in window) {
    await new Promise(resolve => requestIdleCallback(() => start().finally(resolve), { timeout: 1200 }));
  } else {
    await start();
  }
  renderAccountDialog();
}
