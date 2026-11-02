import { APP_CONFIG } from './config.js';
import {
  activeProfile,
  getState,
  getStorageKey,
  hasLegacyState,
  itemIdentity,
  readLegacyState,
  replaceState
} from './store.js';
import { $, clone, escapeHtml, now, showToast } from './utils.js';

export const IMPORT_SAFETY_KEY = 'kagenexus-import-safety-v2';
export const SYNC_CODE_PREFIX = 'KNX1.';
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
export const MAX_LIBRARY_ITEMS = 10_000;

let deferredInstallPrompt = null;

const safetyKey = () => `${IMPORT_SAFETY_KEY}:${getStorageKey()}`;
const timestamp = value => Date.parse(value || 0) || 0;

export function backupPayload(state = getState()) {
  return {
    app: 'KageNexus',
    schema: 2,
    storageKey: getStorageKey(),
    exportedAt: now(),
    state: clone(state)
  };
}

export function backupJson(state = getState()) {
  return JSON.stringify(backupPayload(state), null, 2);
}

export function backupFilename(date = new Date()) {
  return `kagenexus-backup-${date.toISOString().slice(0, 10)}.json`;
}

export function validatePayload(payload) {
  const state = payload?.state || payload;
  if (!state || !Array.isArray(state.profiles) || !state.profiles.some(profile => Array.isArray(profile.items))) {
    throw new Error('That is not a valid KageNexus backup.');
  }
  const size = new TextEncoder().encode(JSON.stringify(state)).byteLength;
  if (size > MAX_BACKUP_BYTES) throw new Error('That backup is too large to import safely.');
  const itemCount = state.profiles.reduce((sum, profile) => sum + (profile.items?.length || 0), 0);
  if (itemCount > MAX_LIBRARY_ITEMS) throw new Error('That backup contains too many library items.');
  return state;
}

function mergeDeletionMaps(left = {}, right = {}) {
  const merged = { ...left };
  for (const [key, value] of Object.entries(right || {})) {
    if (!merged[key] || timestamp(value) > timestamp(merged[key])) merged[key] = value;
  }
  return merged;
}

function mergeProfileItems(currentProfile, incomingProfile, deletedItems) {
  const selected = new Map();
  for (const item of [...(currentProfile?.items || []), ...(incomingProfile?.items || [])]) {
    const key = itemIdentity(item);
    const existing = selected.get(key);
    if (!existing || timestamp(item.updatedAt) >= timestamp(existing.updatedAt)) selected.set(key, clone(item));
  }
  return [...selected.values()].filter(item => (
    timestamp(deletedItems[itemIdentity(item)]) < timestamp(item.updatedAt)
  ));
}

export function mergeStates(current, incoming, { preserveUi = false } = {}) {
  if (!current) return clone(incoming);
  if (!incoming) return clone(current);

  const merged = clone(current);
  const currentProfile = activeProfile(merged);
  const incomingProfile = incoming.profiles?.find(profile => profile.id === incoming.activeProfileId)
    || incoming.profiles?.[0];
  if (!currentProfile || !incomingProfile) return merged;

  const deletedItems = mergeDeletionMaps(current.deletedItems, incoming.deletedItems);
  const currentWasEmpty = currentProfile.items.length === 0;
  const incomingIsNewer = timestamp(incoming.updatedAt) >= timestamp(current.updatedAt);
  const combinedProfile = {
    ...currentProfile,
    ...(currentWasEmpty || incomingIsNewer ? clone(incomingProfile) : {}),
    items: mergeProfileItems(currentProfile, incomingProfile, deletedItems)
  };

  const currentIndex = merged.profiles.findIndex(profile => profile.id === currentProfile.id);
  merged.profiles.splice(Math.max(0, currentIndex), 1, combinedProfile);
  merged.activeProfileId = combinedProfile.id;
  merged.deletedItems = deletedItems;

  if (incomingIsNewer) {
    merged.streak = clone(incoming.streak || merged.streak);
    if (!preserveUi) {
      merged.filter = incoming.filter ?? merged.filter;
      merged.sort = incoming.sort ?? merged.sort;
      merged.listMode = incoming.listMode ?? merged.listMode;
      merged.view = incoming.view ?? merged.view;
    }
  }
  merged.updatedAt = now();
  return merged;
}

export function importPayload(payload, { reload = true, replace = false } = {}) {
  const incoming = validatePayload(payload);
  const current = getState();
  try {
    localStorage.setItem(safetyKey(), JSON.stringify({ savedAt: now(), state: current }));
  } catch (error) {
    console.warn('KageNexus could not create the pre-import safety copy', error);
  }
  const next = replace ? clone(incoming) : mergeStates(current, incoming);
  replaceState(next, { save: true, reason: 'backup-import' });
  try {
    sessionStorage.setItem('kagenexus-mobile-flash', 'Backup merged. Your newest progress was kept for every title.');
  } catch {}
  if (reload && globalThis.location?.reload) globalThis.location.reload();
  return getState();
}

export function importLegacyDeviceData(options = {}) {
  const legacy = readLegacyState();
  if (!legacy) throw new Error('No Release 62 library was found on this device.');
  return importPayload({ app: 'KageNexus', schema: 1, state: legacy }, options);
}

export async function importFile(file, options) {
  if (file.size > MAX_BACKUP_BYTES) throw new Error('That backup is too large to import safely.');
  const parsed = JSON.parse(await file.text());
  return importPayload(parsed, options);
}

export function bytesToBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

export function base64ToBytes(value) {
  const binary = atob(value.replace(/\s+/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export function makeSyncCode(state = getState()) {
  const encoded = new TextEncoder().encode(JSON.stringify(backupPayload(state)));
  return `${SYNC_CODE_PREFIX}${bytesToBase64(encoded)}`;
}

export function parseSyncCode(value) {
  const code = String(value || '').trim();
  if (!code.startsWith(SYNC_CODE_PREFIX)) throw new Error('That import code is not valid.');
  if (code.length > Math.ceil(MAX_BACKUP_BYTES * 1.4)) throw new Error('That import code is too large.');
  return JSON.parse(new TextDecoder().decode(base64ToBytes(code.slice(SYNC_CODE_PREFIX.length))));
}

export function downloadBackup() {
  try {
    const url = URL.createObjectURL(new Blob([backupJson()], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = backupFilename();
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Backup downloaded.', 'success');
  } catch (error) {
    showToast(error.message || 'Backup could not be created.', 'error');
  }
}

export async function shareBackup() {
  try {
    const file = new File([backupJson()], backupFilename(), { type: 'application/json' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: 'KageNexus Backup',
        text: 'My KageNexus anime progress backup',
        files: [file]
      });
      return;
    }
    downloadBackup();
  } catch (error) {
    if (error?.name !== 'AbortError') showToast(error.message || 'Backup could not be shared.', 'error');
  }
}

async function copySyncCode() {
  try {
    await navigator.clipboard.writeText(makeSyncCode());
    showToast('Private import code copied. Paste it only into your own KageNexus account.', 'success');
  } catch {
    showToast('The import code could not be copied. Use Export Backup instead.', 'error');
  }
}

function restoreSafetyBackup() {
  try {
    const payload = JSON.parse(localStorage.getItem(safetyKey()) || 'null');
    if (!payload?.state) throw new Error('No previous import backup is available for this account.');
    if (!confirm('Restore the progress saved immediately before your last import?')) return;
    replaceState(payload.state, { save: true, reason: 'restore-pre-import' });
    location.reload();
  } catch (error) {
    showToast(error.message || 'The safety backup could not be restored.', 'error');
  }
}

function ensureSyncCodeDialog() {
  let dialog = $('#knSyncCodeDialog');
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.id = 'knSyncCodeDialog';
  dialog.className = 'kn-sync-dialog';
  dialog.innerHTML = `<form method="dialog" class="kn-sync-panel">
    <button class="kn-sync-close" value="cancel">CLOSE</button>
    <p>PRIVATE ACCOUNT MIGRATION</p><h2>Paste Import Code</h2>
    <span>Copy the KNX1 code from your old KageNexus Settings screen, then paste it here. Never share it publicly.</span>
    <textarea id="knSyncCodeInput" placeholder="Paste your KNX1 import code"></textarea>
    <button id="knImportSyncCode" type="button">IMPORT & MERGE</button>
  </form>`;
  document.body.appendChild(dialog);
  $('#knImportSyncCode', dialog).addEventListener('click', () => {
    try {
      importPayload(parseSyncCode($('#knSyncCodeInput', dialog).value));
    } catch (error) {
      showToast(error.message || 'That import code could not be imported.', 'error');
    }
  });
  return dialog;
}

export function renderDataSyncPanel() {
  const settings = $('#settingsView');
  if (!settings) return false;
  let panel = $('#knDataSyncPanel');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'knDataSyncPanel';
    panel.className = 'kn-sync-card';
    panel.innerHTML = `<div class="kn-sync-head"><div><p>DATA & MIGRATION</p><h2>Keep Your Nexus Safe</h2></div><span>ACCOUNT-SAFE</span></div>
      <p class="kn-sync-explainer">Back up your account, move your Release 62 phone library, or merge the newest progress title by title.</p>
      <div class="kn-sync-grid">
        <button id="knShareBackup">SHARE BACKUP</button><button id="knExportBackup">EXPORT FILE</button>
        <button id="knCopySyncCode">COPY IMPORT CODE</button><button id="knPasteSyncCode">PASTE IMPORT CODE</button>
        <button id="knImportBackup">IMPORT FILE</button><button id="knMoveLegacy">MOVE OLD DEVICE DATA</button>
        <button id="knRestoreImport">RESTORE PRE-IMPORT</button>
      </div>
      <input id="knImportFile" type="file" accept="application/json,.json" hidden>
      <div class="kn-cloud-note"><strong>AUTOMATIC CLOUD SYNC</strong><span id="knCloudNote">Sign in to keep this account synchronized across your phone and computer.</span></div>`;
    settings.appendChild(panel);
    $('#knShareBackup', panel).addEventListener('click', shareBackup);
    $('#knExportBackup', panel).addEventListener('click', downloadBackup);
    $('#knCopySyncCode', panel).addEventListener('click', copySyncCode);
    $('#knPasteSyncCode', panel).addEventListener('click', () => {
      const dialog = ensureSyncCodeDialog();
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      window.setTimeout(() => $('#knSyncCodeInput', dialog)?.focus(), 80);
    });
    $('#knImportBackup', panel).addEventListener('click', () => $('#knImportFile', panel).click());
    $('#knImportFile', panel).addEventListener('change', event => {
      const file = event.target.files?.[0];
      if (file) importFile(file).catch(error => showToast(error.message || 'That backup could not be imported.', 'error'));
      event.target.value = '';
    });
    $('#knMoveLegacy', panel).addEventListener('click', () => {
      try {
        importLegacyDeviceData();
      } catch (error) {
        showToast(error.message || 'Old device data could not be moved.', 'error');
      }
    });
    $('#knRestoreImport', panel).addEventListener('click', restoreSafetyBackup);
  }
  const legacy = $('#knMoveLegacy', panel);
  if (legacy) {
    legacy.disabled = !hasLegacyState();
    legacy.title = legacy.disabled ? 'No Release 62 save was found on this web address.' : 'Move the old local library into this account.';
  }
  return true;
}

export function renderSettings() {
  const snapshot = globalThis.KageNexusCloud?.getSnapshot?.();
  const status = $('#cloudStatus');
  if (status) {
    if (!APP_CONFIG.supabaseUrl || !APP_CONFIG.supabasePublishableKey) {
      status.textContent = 'Cloud setup is not connected yet. Guest data remains private on this device.';
    } else if (snapshot?.user) {
      status.textContent = snapshot.status === 'syncing'
        ? 'Synchronizing your private account…'
        : `Signed in as ${snapshot.user.email}. ${snapshot.lastSyncedAt ? 'Your cloud copy is current.' : 'Ready for the first sync.'}`;
    } else {
      status.textContent = 'Guest mode is active. Sign in to keep a private copy synchronized across devices.';
    }
  }
  const note = $('#knCloudNote');
  if (note && snapshot?.lastSyncedAt) note.textContent = `Last synchronized ${new Date(snapshot.lastSyncedAt).toLocaleString()}.`;
  renderDataSyncPanel();
}

async function syncNow() {
  try {
    const cloud = await import('./cloud.js');
    await cloud.syncCloudNow({ force: true });
    renderSettings();
    showToast('Your account is synchronized.', 'success');
  } catch (error) {
    showToast(error.message || 'Cloud sync could not finish.', 'error');
  }
}

export function bindSettingsEvents() {
  if (document.documentElement.dataset.knCoreSettingsBound) return;
  document.documentElement.dataset.knCoreSettingsBound = '1';
  $('#exportData')?.addEventListener('click', downloadBackup);
  $('#importData')?.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (file) importFile(file).catch(error => showToast(error.message || 'Could not import that backup.', 'error'));
    event.target.value = '';
  });
  $('#syncNow')?.addEventListener('click', syncNow);
  $('#installApp')?.addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      showToast('Install request opened.');
      return;
    }
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    showToast(isIos ? 'In Safari tap Share then Add to Home Screen.' : 'Use your browser menu and choose Install app.');
  });
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    const hint = $('#installHint');
    if (hint) hint.textContent = 'This device is ready. Tap Install app below.';
  });
  window.addEventListener('kagenexus-cloud-status', renderSettings);
  renderDataSyncPanel();
}

export function backupPanelMarkupForTest() {
  return `<span>${escapeHtml(backupFilename())}</span>`;
}
