import { APP_CONFIG } from './config.js';
import { mergeStates, validatePayload } from './settings.js';
import {
  activeProfile,
  GUEST_STORAGE_KEY,
  getState,
  replaceState,
  subscribe,
  switchStorageScope,
  userStorageKey
} from './store.js';
import { clone, now } from './utils.js';

const DEVICE_KEY = 'kagenexus-device-id-v1';
const META_PREFIX = 'kagenexus-cloud-meta-v1:';
const NO_AUTO_SYNC_REASONS = new Set([
  'load',
  'view',
  'filter',
  'sort',
  'search-view',
  'cloud-pull',
  'cloud-scope'
]);

let client = null;
let createClientOverride = null;
let authSubscription = null;
let storeSubscription = null;
let realtimeChannel = null;
let currentUser = null;
let activeUserId = null;
let status = 'guest';
let lastError = '';
let lastSyncedAt = '';
let syncTimer = 0;
let syncPromise = null;
let renderApp = () => {};
let initialized = false;
let initPromise = null;
let suppressStoreSync = false;

function getDeviceId() {
  try {
    let value = localStorage.getItem(DEVICE_KEY);
    if (!value) {
      value = crypto.randomUUID?.() || `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(DEVICE_KEY, value);
    }
    return value;
  } catch {
    return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

const deviceId = getDeviceId();

export function isCloudConfigured() {
  return Boolean(APP_CONFIG.supabaseUrl && APP_CONFIG.supabasePublishableKey);
}

export function hasStoredCloudSession() {
  if (!isCloudConfigured()) return false;
  try {
    const projectRef = new URL(APP_CONFIG.supabaseUrl).hostname.split('.')[0];
    return Boolean(projectRef && localStorage.getItem(`sb-${projectRef}-auth-token`));
  } catch {
    return false;
  }
}

export function getCloudSnapshot() {
  return {
    configured: isCloudConfigured(),
    status,
    user: currentUser ? { id: currentUser.id, email: currentUser.email || '' } : null,
    lastError,
    lastSyncedAt
  };
}

function emitStatus() {
  globalThis.dispatchEvent?.(new CustomEvent('kagenexus-cloud-status', { detail: getCloudSnapshot() }));
}

function setStatus(next, error = '') {
  status = next;
  lastError = error;
  emitStatus();
}

function profileName(user) {
  const display = String(user?.user_metadata?.display_name || '').trim();
  if (display) return display.slice(0, 60);
  const emailName = String(user?.email || '').split('@')[0].trim();
  return emailName || 'My Nexus';
}

function redirectUrl() {
  const url = new URL(globalThis.location?.href || 'https://ashtonfarmer.github.io/Anime-Haven/');
  url.search = '';
  url.hash = '';
  return url.href;
}

function metaKey(userId) {
  return `${META_PREFIX}${userId}`;
}

function readMeta(userId) {
  try {
    return JSON.parse(localStorage.getItem(metaKey(userId)) || 'null') || {};
  } catch {
    return {};
  }
}

function writeMeta(userId, value) {
  try { localStorage.setItem(metaKey(userId), JSON.stringify(value)); } catch {}
}

export function prepareCloudState(candidate = getState()) {
  const prepared = clone(candidate);
  prepared.view = 'home';
  prepared.listMode = 'watched';
  prepared.filter = 'all';
  prepared.sort = 'alpha';
  return prepared;
}

function stableSort(value) {
  if (Array.isArray(value)) return value.map(stableSort);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stableSort(value[key])]));
}

export function fingerprintCloudState(candidate = getState()) {
  const prepared = prepareCloudState(candidate);
  delete prepared.updatedAt;
  const text = JSON.stringify(stableSort(prepared));
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function hasContent(candidate) {
  return Boolean(activeProfile(candidate)?.items?.length || Object.keys(candidate?.deletedItems || {}).length);
}

function applyRemoteState(remote) {
  const local = getState();
  const next = {
    ...remote,
    view: local.view,
    listMode: local.listMode,
    filter: local.filter,
    sort: local.sort
  };
  suppressStoreSync = true;
  try {
    replaceState(next, { save: true, reason: 'cloud-pull' });
  } finally {
    suppressStoreSync = false;
  }
  renderApp();
}

async function readRemoteRow() {
  const { data, error } = await client
    .from(APP_CONFIG.cloudTable)
    .select('state,revision,updated_at,device_id')
    .eq('user_id', currentUser.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function insertRemoteState(candidate) {
  const { data, error } = await client
    .from(APP_CONFIG.cloudTable)
    .insert({
      user_id: currentUser.id,
      state: prepareCloudState(candidate),
      revision: 1,
      device_id: deviceId,
      updated_at: now()
    })
    .select('state,revision,updated_at,device_id')
    .single();
  if (error) throw error;
  return data;
}

async function updateRemoteState(candidate, expectedRevision) {
  const { data, error } = await client
    .from(APP_CONFIG.cloudTable)
    .update({
      state: prepareCloudState(candidate),
      revision: expectedRevision + 1,
      device_id: deviceId,
      updated_at: now()
    })
    .eq('user_id', currentUser.id)
    .eq('revision', expectedRevision)
    .select('state,revision,updated_at,device_id')
    .maybeSingle();
  if (error) throw error;
  return data;
}

function rememberSync(row, candidate) {
  lastSyncedAt = row?.updated_at || now();
  writeMeta(currentUser.id, {
    revision: Number(row?.revision || 0),
    hash: fingerprintCloudState(candidate),
    lastSyncedAt
  });
}

async function performSync() {
  if (!currentUser || !client) throw new Error('Sign in before syncing your account.');
  if (globalThis.navigator && navigator.onLine === false) throw new Error('You are offline. Your changes are saved and will sync when you reconnect.');
  setStatus('syncing');

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const remoteRow = await readRemoteRow();
    const local = getState();
    const meta = readMeta(currentUser.id);

    if (!remoteRow) {
      try {
        const inserted = await insertRemoteState(local);
        rememberSync(inserted, local);
        setStatus('synced');
        return local;
      } catch (error) {
        if (attempt < 2 && String(error?.code || '') === '23505') continue;
        throw error;
      }
    }

    const remote = validatePayload(remoteRow.state);
    const localHash = fingerprintCloudState(local);
    const remoteHash = fingerprintCloudState(remote);
    const localChanged = meta.hash ? localHash !== meta.hash : hasContent(local);
    const remoteChanged = meta.revision ? Number(remoteRow.revision) !== Number(meta.revision) : hasContent(remote);

    if (!localChanged && remoteHash !== localHash) {
      applyRemoteState(remote);
      rememberSync(remoteRow, getState());
      setStatus('synced');
      return getState();
    }

    if (!localChanged && remoteHash === localHash) {
      rememberSync(remoteRow, local);
      setStatus('synced');
      return local;
    }

    const next = remoteChanged
      ? mergeStates(remote, local, { preserveUi: true })
      : local;
    const updated = await updateRemoteState(next, Number(remoteRow.revision));
    if (!updated) continue;
    if (next !== local) applyRemoteState(next);
    rememberSync(updated, getState());
    setStatus('synced');
    return getState();
  }
  throw new Error('Your account changed on another device. Please try Sync now again.');
}

export function syncCloudNow() {
  if (syncPromise) return syncPromise;
  syncPromise = performSync()
    .catch(error => {
      setStatus(globalThis.navigator && navigator.onLine === false ? 'offline' : 'error', error.message || String(error));
      throw error;
    })
    .finally(() => { syncPromise = null; });
  return syncPromise;
}

function scheduleSync(delay = 900) {
  if (!currentUser) return;
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    syncCloudNow().catch(error => console.warn('KageNexus cloud sync is waiting to retry', error));
  }, delay);
}

async function stopRealtime() {
  if (!realtimeChannel || !client) return;
  const channel = realtimeChannel;
  realtimeChannel = null;
  try { await client.removeChannel(channel); } catch {}
}

function startRealtime() {
  if (!currentUser || !client) return;
  stopRealtime();
  realtimeChannel = client
    .channel(`user-state:${currentUser.id}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: APP_CONFIG.cloudTable,
      filter: `user_id=eq.${currentUser.id}`
    }, payload => {
      if (payload.new?.device_id === deviceId) return;
      scheduleSync(120);
    })
    .subscribe();
}

async function activateSession(session) {
  const user = session?.user || null;
  if (!user) {
    if (activeUserId) {
      await stopRealtime();
      activeUserId = null;
      currentUser = null;
      switchStorageScope({
        storageKey: GUEST_STORAGE_KEY,
        profile: { id: 'guest', name: 'Guest' }
      });
      renderApp();
    }
    setStatus('guest');
    return;
  }

  currentUser = user;
  if (activeUserId !== user.id) {
    activeUserId = user.id;
    switchStorageScope({
      storageKey: userStorageKey(user.id),
      profile: { id: 'primary', name: profileName(user) }
    });
    renderApp();
  }
  startRealtime();
  await syncCloudNow();
}

async function loadCreateClient() {
  if (createClientOverride) return createClientOverride;
  const module = await import('../vendor/supabase.js');
  return module.createClient;
}

export function configureCloud({ createClient, render } = {}) {
  if (createClient) createClientOverride = createClient;
  if (render) renderApp = render;
}

async function initializeCloud() {
  globalThis.KageNexusCloud = Object.freeze({ getSnapshot: getCloudSnapshot, sync: syncCloudNow });
  if (!isCloudConfigured()) {
    initialized = true;
    setStatus('unconfigured');
    return getCloudSnapshot();
  }

  const createClient = await loadCreateClient();
  client = createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabasePublishableKey, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
  });
  const auth = client.auth.onAuthStateChange((event, session) => {
    globalThis.dispatchEvent?.(new CustomEvent('kagenexus-auth-event', { detail: { event } }));
    queueMicrotask(() => activateSession(session).catch(error => {
      setStatus('error', error.message || String(error));
    }));
  });
  authSubscription = auth.data.subscription;
  storeSubscription = subscribe((_state, reason) => {
    if (suppressStoreSync || NO_AUTO_SYNC_REASONS.has(reason)) return;
    scheduleSync();
  });
  window.addEventListener('online', () => scheduleSync(50));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && currentUser) scheduleSync(150);
  });

  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  await activateSession(data.session);
  initialized = true;
  return getCloudSnapshot();
}

export function initCloud({ render } = {}) {
  if (render) renderApp = render;
  if (initialized) return Promise.resolve(getCloudSnapshot());
  if (initPromise) return initPromise;
  initPromise = initializeCloud()
    .catch(error => {
      client = null;
      initialized = false;
      throw error;
    })
    .finally(() => { initPromise = null; });
  return initPromise;
}

async function requireClient() {
  if (!initialized || initPromise) await initCloud();
  if (!client) throw new Error('Cloud accounts are not connected yet.');
  return client;
}

export async function signUp({ email, password, displayName = '' }) {
  const supabase = await requireClient();
  const { data, error } = await supabase.auth.signUp({
    email: String(email || '').trim(),
    password: String(password || ''),
    options: {
      emailRedirectTo: redirectUrl(),
      data: { display_name: String(displayName || '').trim().slice(0, 60) }
    }
  });
  if (error) throw error;
  return data;
}

export async function signIn({ email, password }) {
  const supabase = await requireClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(email || '').trim(),
    password: String(password || '')
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = await requireClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function requestPasswordReset(email) {
  const supabase = await requireClient();
  const { error } = await supabase.auth.resetPasswordForEmail(String(email || '').trim(), {
    redirectTo: redirectUrl()
  });
  if (error) throw error;
}

export async function updatePassword(password) {
  const supabase = await requireClient();
  const { error } = await supabase.auth.updateUser({ password: String(password || '') });
  if (error) throw error;
}

export async function destroyCloud() {
  window.clearTimeout(syncTimer);
  await stopRealtime();
  authSubscription?.unsubscribe?.();
  storeSubscription?.();
  authSubscription = null;
  storeSubscription = null;
  client = null;
  initialized = false;
  initPromise = null;
}
