import { clone, normalizeTitle, now, uid } from './utils.js';

export const LEGACY_STORAGE_KEY = 'anime-haven-state-v2';
export const GUEST_STORAGE_KEY = 'kagenexus-guest-state-v3';
export const USER_STORAGE_PREFIX = 'kagenexus-user-state-v3:';
export const STORAGE_KEY = GUEST_STORAGE_KEY;
export const STATE_VERSION = 3;
export const ACCENT_PALETTE = ['#4f7cff', '#9a5cff', '#3fe1e8', '#ff54c8', '#ff755c', '#61e994', '#ffd45c'];

const listeners = new Set();
let state = null;
let storageOverride = null;
let activeStorageKey = GUEST_STORAGE_KEY;
let defaultProfile = { id: 'guest', name: 'Guest' };

const storage = () => storageOverride || globalThis.localStorage;

function accentFor(value) {
  const text = normalizeTitle(value) || 'kagenexus';
  let hash = 0;
  for (const character of text) hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
  return ACCENT_PALETTE[hash % ACCENT_PALETTE.length];
}

export function userStorageKey(userId) {
  const safe = String(userId || '').replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safe) throw new Error('A valid account ID is required.');
  return `${USER_STORAGE_PREFIX}${safe}`;
}

export function getStorageKey() {
  return activeStorageKey;
}

export function itemIdentity(item = {}) {
  if (item.anilistId) return `anilist:${item.anilistId}`;
  return `title:${normalizeTitle(item.title || item.id || '')}`;
}

export function normalizeItem(item = {}) {
  const seasonHistory = Array.isArray(item.seasonHistory) ? item.seasonHistory : [];
  const title = item.title || 'Untitled Anime';
  const repairedId = item.id === 'seed-how-not-to-summon-a-demon-lord'
    && title === 'How Not to Summon a Demon Lord Ω'
    ? 'seed-how-not-to-summon-a-demon-lord-omega'
    : item.id;
  return {
    ...item,
    id: repairedId || uid(),
    title,
    status: ['planned', 'watching', 'completed'].includes(item.status) ? item.status : 'planned',
    season: Math.max(0, Number(item.season ?? 1)),
    episode: Math.max(0, Number(item.episode ?? 0)),
    completedSeasons: Math.max(0, Number(item.completedSeasons ?? 0)),
    totalEpisodes: Number(item.totalEpisodes) > 0 ? Number(item.totalEpisodes) : null,
    episodesLogged: Math.max(0, Number(item.episodesLogged ?? item.episode ?? 0)),
    seasonHistory,
    progressNote: item.progressNote || '',
    mediaType: item.mediaType || 'series',
    franchise: item.franchise || title || 'Unknown franchise',
    seriesOrder: Number(item.seriesOrder ?? 1),
    chronologyKey: Number(item.chronologyKey ?? item.seriesOrder ?? 1),
    accent: item.accent || accentFor(title),
    updatedAt: item.updatedAt || now(),
    source: item.source || 'manual',
    anilistId: item.anilistId || null,
    coverImage: item.coverImage || '',
    startDate: item.startDate || null,
    relationOrder: Array.isArray(item.relationOrder) ? item.relationOrder : []
  };
}

function cleanDeletedItems(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value)
    .filter(([key, timestamp]) => key && Number.isFinite(Date.parse(timestamp))));
}

export function makeInitialState(seed = [], profile = defaultProfile) {
  const safeProfile = {
    id: String(profile?.id || 'guest'),
    name: String(profile?.name || 'Guest')
  };
  return {
    version: STATE_VERSION,
    activeProfileId: safeProfile.id,
    view: 'home',
    listMode: 'watched',
    filter: 'all',
    sort: 'alpha',
    profiles: [{
      id: safeProfile.id,
      name: safeProfile.name,
      items: clone(seed || []).map(normalizeItem)
    }],
    deletedItems: {},
    streak: { lastLogDate: null, days: 0 },
    createdAt: now(),
    updatedAt: now()
  };
}

export function migrateState(candidate, seed = [], profile = defaultProfile) {
  const initial = makeInitialState(seed, profile);
  if (!candidate || !Array.isArray(candidate.profiles) || candidate.profiles.length < 1) return initial;

  const supportedViews = new Set(['home', 'list', 'search', 'settings', 'arsenal']);
  const profiles = candidate.profiles
    .filter(entry => entry && Array.isArray(entry.items))
    .map((entry, index) => ({
      ...entry,
      id: String(entry.id || (index === 0 ? profile.id : uid())),
      name: String(entry.name || (index === 0 ? profile.name : 'Profile')),
      items: entry.items.map(normalizeItem)
    }));
  if (!profiles.length) return initial;
  const active = profiles.find(entry => entry.id === candidate.activeProfileId) || profiles[0];
  const next = {
    ...initial,
    ...candidate,
    version: STATE_VERSION,
    activeProfileId: active.id,
    view: supportedViews.has(candidate.view) ? candidate.view : 'home',
    listMode: candidate.listMode === 'planned' ? 'planned' : 'watched',
    filter: ['all', 'watching', 'completed'].includes(candidate.filter) ? candidate.filter : 'all',
    sort: ['alpha', 'chronology', 'recent'].includes(candidate.sort) ? candidate.sort : 'alpha',
    profiles,
    deletedItems: cleanDeletedItems(candidate.deletedItems),
    streak: {
      lastLogDate: candidate.streak?.lastLogDate || null,
      days: Math.max(0, Number(candidate.streak?.days || 0))
    }
  };
  return next;
}

export function configureStore({ storage: nextStorage, storageKey, profile } = {}) {
  storageOverride = nextStorage || null;
  if (storageKey) activeStorageKey = storageKey;
  if (profile) defaultProfile = { id: profile.id || 'guest', name: profile.name || 'Guest' };
  state = null;
}

export function switchStorageScope({ storageKey, profile }, { load = true } = {}) {
  if (!storageKey) throw new Error('A storage scope is required.');
  activeStorageKey = storageKey;
  defaultProfile = { id: profile?.id || 'primary', name: profile?.name || 'My Nexus' };
  state = null;
  return load ? loadState() : null;
}

export function loadState({ seed = [], profile = defaultProfile } = {}) {
  try {
    const raw = storage()?.getItem?.(activeStorageKey);
    state = raw ? migrateState(JSON.parse(raw), seed, profile) : makeInitialState(seed, profile);
    const serialized = JSON.stringify(state);
    if (serialized !== raw) storage()?.setItem?.(activeStorageKey, serialized);
  } catch (error) {
    console.warn('KageNexus could not load saved progress', error);
    state = makeInitialState(seed, profile);
  }
  notify('load');
  return state;
}

export function getState() {
  return state || loadState();
}

export function saveState(reason = 'save') {
  const current = getState();
  current.updatedAt = now();
  try {
    storage()?.setItem?.(activeStorageKey, JSON.stringify(current));
    notify(reason);
    return true;
  } catch (error) {
    console.warn('Could not save KageNexus progress', error);
    globalThis.dispatchEvent?.(new CustomEvent('kagenexus-save-error', { detail: { error } }));
    return false;
  }
}

export function replaceState(candidate, { save = true, reason = 'replace' } = {}) {
  state = migrateState(candidate, [], defaultProfile);
  if (save) saveState(reason);
  else notify(reason);
  return state;
}

export function mutateState(mutator, reason = 'update') {
  const current = getState();
  mutator(current);
  saveState(reason);
  return current;
}

export function activeProfile(candidate = getState()) {
  return candidate.profiles.find(profile => profile.id === candidate.activeProfileId)
    || candidate.profiles[0];
}

export function findItem(profileId, itemId, candidate = getState()) {
  const profile = candidate.profiles.find(entry => entry.id === profileId);
  return { profile, item: profile?.items.find(entry => String(entry.id) === String(itemId)) };
}

export function recordItemDeletion(item, candidate = getState()) {
  const key = itemIdentity(item);
  if (!key || key === 'title:') return;
  candidate.deletedItems ||= {};
  candidate.deletedItems[key] = now();
}

export function clearItemDeletion(item, candidate = getState()) {
  const key = itemIdentity(item);
  if (candidate.deletedItems?.[key]) delete candidate.deletedItems[key];
}

export function readLegacyState() {
  try {
    const raw = storage()?.getItem?.(LEGACY_STORAGE_KEY);
    return raw ? migrateState(JSON.parse(raw), [], { id: 'legacy', name: 'Imported Profile' }) : null;
  } catch (error) {
    console.warn('KageNexus could not read the legacy device library', error);
    return null;
  }
}

export function hasLegacyState() {
  return Boolean(readLegacyState()?.profiles?.some(profile => profile.items?.length));
}

export function updateStreak(candidate = getState()) {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  candidate.streak ||= { lastLogDate: null, days: 0 };
  if (candidate.streak.lastLogDate === todayKey) return;
  const previous = candidate.streak.lastLogDate
    ? new Date(`${candidate.streak.lastLogDate}T12:00:00`)
    : null;
  const difference = previous
    ? Math.round((new Date(`${todayKey}T12:00:00`) - previous) / 86400000)
    : null;
  candidate.streak.days = difference === 1 ? Math.max(1, Number(candidate.streak.days || 0) + 1) : 1;
  candidate.streak.lastLogDate = todayKey;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(reason) {
  for (const listener of listeners) listener(state, reason);
  globalThis.dispatchEvent?.(new CustomEvent('kagenexus-state-change', {
    detail: { state, reason, storageKey: activeStorageKey }
  }));
}
