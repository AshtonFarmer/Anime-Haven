import { ANIME_SEED } from './data/library-seed.js';
import { clone, normalizeTitle, now, uid } from './utils.js';

export const STORAGE_KEY = 'anime-haven-state-v2';
export const STATE_VERSION = 2;
export const LIBRARY_MIGRATION_VERSION = 15;
export const ACCENT_PALETTE = ['#4f7cff', '#9a5cff', '#3fe1e8', '#ff54c8', '#ff755c', '#61e994', '#ffd45c'];

const SINGLE_MEDIA_KIND = {
  'black clover sword of the wizard king': 'MOVIE',
  'blue exorcist the movie': 'MOVIE',
  'demon slayer mugen train': 'MOVIE',
  'my hero academia two heroes': 'MOVIE',
  'my hero academia heroes rising': 'MOVIE',
  'my hero academia world heroes mission': 'MOVIE',
  'my hero academia youre next': 'MOVIE',
  'rezero memory snow': 'OVA',
  'rezero the frozen bond': 'OVA',
  'a certain magical index the movie the miracle of endymion': 'MOVIE',
  'sword art online the movie ordinal scale': 'MOVIE',
  'sword art online progressive aria of a starless night': 'MOVIE',
  'sword art online progressive scherzo of deep night': 'MOVIE',
  'spy x family code white': 'MOVIE',
  'hunter x hunter phantom rouge': 'MOVIE',
  'hunter x hunter the last mission': 'MOVIE'
};

const EXTRA_MOVIES = [
  { title: 'SPY x FAMILY CODE: White', franchise: 'Spy x Family', seriesOrder: 2, accent: '#ff755c' },
  { title: 'Hunter x Hunter: Phantom Rouge', franchise: 'Hunter x Hunter', seriesOrder: 2, accent: '#9a5cff' },
  { title: 'Hunter x Hunter: The Last Mission', franchise: 'Hunter x Hunter', seriesOrder: 3, accent: '#3fe1e8' }
];

const listeners = new Set();
let state = null;
let storageOverride = null;

const storage = () => storageOverride || globalThis.localStorage;

function accentFor(value) {
  const text = normalizeTitle(value) || 'kagenexus';
  let hash = 0;
  for (const character of text) hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
  return ACCENT_PALETTE[hash % ACCENT_PALETTE.length];
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

export function applyLibraryMigrationV15(candidate) {
  const profile = candidate?.profiles?.find(entry => entry.id === 'ashton') || candidate?.profiles?.[0];
  if (!profile || !Array.isArray(profile.items)) return candidate;
  const byTitle = new Map(profile.items.map(item => [normalizeTitle(item.title), item]));
  profile.items.forEach(item => {
    const kind = SINGLE_MEDIA_KIND[normalizeTitle(item.title)];
    if (!kind) return;
    item.mediaType = 'movie';
    item.season = 0;
    item.episode = item.status === 'completed' ? 1 : 0;
    item.totalEpisodes = 1;
    item.episodesLogged = 0;
    item.progressNote = item.status === 'completed' ? `${kind} watched` : `${kind} not watched`;
  });
  EXTRA_MOVIES.forEach(movie => {
    const key = normalizeTitle(movie.title);
    if (byTitle.has(key)) return;
    const item = normalizeItem({
      id: `migration-${key.replace(/ /g, '-')}`,
      title: movie.title,
      status: 'completed',
      season: 0,
      episode: 1,
      completedSeasons: 0,
      totalEpisodes: 1,
      episodesLogged: 0,
      seasonHistory: [],
      progressNote: 'Movie watched',
      mediaType: 'movie',
      franchise: movie.franchise,
      seriesOrder: movie.seriesOrder,
      chronologyKey: movie.seriesOrder,
      accent: movie.accent,
      updatedAt: '2026-07-22T00:00:00.000Z',
      source: 'migration'
    });
    profile.items.push(item);
    byTitle.set(key, item);
  });
  const spy = byTitle.get(normalizeTitle('Spy x Family'));
  if (spy && /movie/i.test(spy.progressNote || '')) spy.progressNote = 'Season 2 Episode 12 Finale';
  const hunter = byTitle.get(normalizeTitle('Hunter x Hunter'));
  if (hunter && /movie/i.test(hunter.progressNote || '')) hunter.progressNote = 'Season 6 Finale';
  candidate.libraryMigrationVersion = LIBRARY_MIGRATION_VERSION;
  return candidate;
}

export function makeInitialState(seed = ANIME_SEED) {
  return applyLibraryMigrationV15({
    version: STATE_VERSION,
    activeProfileId: 'ashton',
    view: 'home',
    listMode: 'watched',
    filter: 'all',
    sort: 'alpha',
    profiles: [
      {
        id: 'ashton',
        name: 'Ashton',
        items: clone(seed || []).map(normalizeItem)
      }
    ],
    streak: { lastLogDate: null, days: 0 },
    createdAt: now(),
    updatedAt: now()
  });
}

export function migrateState(candidate, seed = ANIME_SEED) {
  const initial = makeInitialState(seed);
  if (!candidate || !Array.isArray(candidate.profiles) || candidate.profiles.length < 1) return initial;

  const savedAshton = candidate.profiles.find(profile => profile.id === 'ashton') || candidate.profiles[0];
  const supportedViews = new Set(['home', 'list', 'search', 'settings', 'arsenal']);
  const next = {
    ...initial,
    ...candidate,
    version: STATE_VERSION,
    activeProfileId: 'ashton',
    view: supportedViews.has(candidate.view) ? candidate.view : 'home',
    listMode: candidate.listMode === 'planned' ? 'planned' : 'watched',
    filter: ['all', 'watching', 'completed'].includes(candidate.filter) ? candidate.filter : 'all',
    sort: ['alpha', 'chronology', 'recent'].includes(candidate.sort) ? candidate.sort : 'alpha',
    profiles: [{
      ...savedAshton,
      id: 'ashton',
      name: savedAshton.name || 'Ashton',
      items: (savedAshton.items || []).map(normalizeItem)
    }],
    streak: {
      lastLogDate: candidate.streak?.lastLogDate || null,
      days: Math.max(0, Number(candidate.streak?.days || 0))
    }
  };
  return applyLibraryMigrationV15(next);
}

export function configureStore({ storage: nextStorage } = {}) {
  storageOverride = nextStorage || null;
}

export function loadState({ seed = ANIME_SEED } = {}) {
  try {
    const raw = storage()?.getItem?.(STORAGE_KEY);
    state = raw ? migrateState(JSON.parse(raw), seed) : makeInitialState(seed);
    const serialized = JSON.stringify(state);
    if (serialized !== raw) storage()?.setItem?.(STORAGE_KEY, serialized);
  } catch (error) {
    console.warn('KageNexus could not load saved progress', error);
    state = makeInitialState(seed);
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
    storage()?.setItem?.(STORAGE_KEY, JSON.stringify(current));
    notify(reason);
    return true;
  } catch (error) {
    console.warn('Could not save KageNexus progress', error);
    globalThis.dispatchEvent?.(new CustomEvent('kagenexus-save-error', { detail: { error } }));
    return false;
  }
}

export function replaceState(candidate, { save = true, reason = 'replace' } = {}) {
  state = migrateState(candidate);
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
  globalThis.dispatchEvent?.(new CustomEvent('kagenexus-state-change', { detail: { state, reason } }));
}
