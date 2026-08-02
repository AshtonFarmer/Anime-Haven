import { APP_CONFIG } from './config.js';
import { getState, replaceState, STORAGE_KEY } from './store.js';
import { $, clone, escapeHtml, normalizeTitle, now, showToast } from './utils.js';

export const IMPORT_SAFETY_KEY = 'kagenexus-import-safety-v1';
export const SYNC_CODE_PREFIX = 'KNX1.';

let deferredInstallPrompt = null;

export function backupPayload(state = getState()) {
  return {
    app: 'KageNexus',
    schema: 1,
    storageKey: STORAGE_KEY,
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
  return state;
}

export function mergeStates(current, incoming) {
  if (!current) return clone(incoming);
  const merged = clone(current);
  merged.profiles ||= [];
  for (const incomingProfile of incoming.profiles || []) {
    let target = merged.profiles.find(profile => profile.id === incomingProfile.id)
      || merged.profiles.find(profile => profile.name === incomingProfile.name);
    if (!target) {
      merged.profiles.push(clone(incomingProfile));
      continue;
    }
    target.items ||= [];
    const byId = new Map(target.items.map(item => [String(item.id), item]));
    const byTitle = new Map(target.items.map(item => [normalizeTitle(item.title), item]));
    for (const incomingItem of incomingProfile.items || []) {
      const existing = byId.get(String(incomingItem.id)) || byTitle.get(normalizeTitle(incomingItem.title));
      if (!existing) {
        const added = clone(incomingItem);
        target.items.push(added);
        byId.set(String(added.id), added);
        byTitle.set(normalizeTitle(added.title), added);
        continue;
      }
      const incomingTime = Date.parse(incomingItem.updatedAt || 0) || 0;
      const existingTime = Date.parse(existing.updatedAt || 0) || 0;
      if (incomingTime >= existingTime) Object.assign(existing, clone(incomingItem));
    }
  }
  const incomingUpdated = Date.parse(incoming.updatedAt || 0) || 0;
  const currentUpdated = Date.parse(current.updatedAt || 0) || 0;
  if (incomingUpdated > currentUpdated) {
    merged.streak = clone(incoming.streak || merged.streak);
    merged.filter = incoming.filter ?? merged.filter;
    merged.sort = incoming.sort ?? merged.sort;
  }
  merged.updatedAt = now();
  return merged;
}

export function importPayload(payload, { reload = true } = {}) {
  const incoming = validatePayload(payload);
  const current = getState();
  try {
    localStorage.setItem(IMPORT_SAFETY_KEY, JSON.stringify({ savedAt: now(), state: current }));
  } catch (error) {
    console.warn('KageNexus could not create the pre-import safety copy', error);
  }
  const merged = mergeStates(current, incoming);
  replaceState(merged, { save: true, reason: 'backup-import' });
  try {
    sessionStorage.setItem('kagenexus-mobile-flash', 'Backup merged. Your newest progress was kept for every title.');
  } catch {}
  if (reload && globalThis.location?.reload) globalThis.location.reload();
  return getState();
}

export async function importFile(file, options) {
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
  if (!code.startsWith(SYNC_CODE_PREFIX)) throw new Error('That sync code is not valid.');
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
    showToast('Sync code copied. Paste it on your other device.', 'success');
  } catch {
    showToast('The sync code could not be copied. Use Export Backup instead.', 'error');
  }
}

function restoreSafetyBackup() {
  try {
    const payload = JSON.parse(localStorage.getItem(IMPORT_SAFETY_KEY) || 'null');
    if (!payload?.state) throw new Error('No previous import backup is available.');
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
    <p>MANUAL CROSS-DEVICE SYNC</p><h2>Paste Sync Code</h2>
    <textarea id="knSyncCodeInput" placeholder="Paste the KNX1 sync code from your other device"></textarea>
    <button id="knImportSyncCode" type="button">IMPORT & MERGE</button>
  </form>`;
  document.body.appendChild(dialog);
  $('#knImportSyncCode', dialog).addEventListener('click', () => {
    try {
      importPayload(parseSyncCode($('#knSyncCodeInput', dialog).value));
    } catch (error) {
      showToast(error.message || 'That sync code could not be imported.', 'error');
    }
  });
  return dialog;
}

export function renderDataSyncPanel() {
  const settings = $('#settingsView');
  if (!settings) return false;
  let panel = $('#knDataSyncPanel');
  if (panel) return true;
  panel = document.createElement('section');
  panel.id = 'knDataSyncPanel';
  panel.className = 'kn-sync-card';
  panel.innerHTML = `<div class="kn-sync-head"><div><p>DATA & SYNC</p><h2>Keep Your Nexus Safe</h2></div><span>MANUAL SYNC READY</span></div>
    <p class="kn-sync-explainer">Back up everything, move progress between your phone and laptop, and safely merge the newest progress for each title.</p>
    <div class="kn-sync-grid">
      <button id="knShareBackup">SHARE BACKUP</button><button id="knExportBackup">EXPORT FILE</button>
      <button id="knCopySyncCode">COPY SYNC CODE</button><button id="knPasteSyncCode">PASTE SYNC CODE</button>
      <button id="knImportBackup">IMPORT FILE</button><button id="knRestoreImport">RESTORE PRE-IMPORT</button>
    </div>
    <input id="knImportFile" type="file" accept="application/json,.json" hidden>
    <div class="kn-cloud-note"><strong>AUTOMATIC CLOUD SYNC</strong><span>The app is ready for it, but GitHub Pages cannot securely store private account data by itself. A database/login connection is still required.</span></div>`;
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
  $('#knRestoreImport', panel).addEventListener('click', restoreSafetyBackup);
  return true;
}

export function renderSettings() {
  const status = $('#cloudStatus');
  if (status) {
    status.textContent = APP_CONFIG.supabaseUrl && APP_CONFIG.supabaseAnonKey
      ? 'Cloud connector configured. Use Sync now to upload the newest copy.'
      : 'Local save is active and survives closing the app. Export/import works between devices. Live phone ↔ laptop sync needs a secure account connection.';
  }
  renderDataSyncPanel();
}

async function syncNow() {
  if (!APP_CONFIG.supabaseUrl || !APP_CONFIG.supabaseAnonKey) {
    showToast('Cloud sync needs a secure account connection first. Local saving is already active.');
    return;
  }
  showToast('Connector detected. Add your private sync table and login before production use.');
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
  renderDataSyncPanel();
}

export function backupPanelMarkupForTest() {
  return `<span>${escapeHtml(backupFilename())}</span>`;
}
