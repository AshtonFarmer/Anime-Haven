import { activeProfile, getState, normalizeItem, saveState, updateStreak } from './store.js';
import { animeCard } from './library.js';
import { $, clone, escapeHtml, now, showToast, uid } from './utils.js';

const ANILIST_URL = 'https://graphql.anilist.co';
const ACCENTS = ['#4f7cff', '#9a5cff', '#3fe1e8', '#ff54c8', '#ff755c', '#61e994', '#ffd45c'];
let externalResults = [];
let searchRequest = 0;
let requestRender = () => {};
let fetchImplementation = (...arguments_) => fetch(...arguments_);

export function configureSearch({ render, fetchImpl } = {}) {
  if (render) requestRender = render;
  if (fetchImpl) fetchImplementation = fetchImpl;
}

function dateKey(date) {
  if (!date?.year) return 99999999;
  return date.year * 10000 + (date.month || 1) * 100 + (date.day || 1);
}

export function externalToItem(media, index = 0) {
  const title = media.title?.english || media.title?.romaji || media.title?.native || 'Untitled Anime';
  const relations = (media.relations?.edges || [])
    .filter(edge => ['PREQUEL', 'SEQUEL', 'PARENT', 'SIDE_STORY', 'ALTERNATIVE'].includes(edge.relationType))
    .map(edge => ({
      type: edge.relationType,
      id: edge.node.id,
      title: edge.node.title?.english || edge.node.title?.romaji || 'Related title',
      date: dateKey(edge.node.startDate)
    }))
    .sort((left, right) => left.date - right.date);
  const timeline = [{ id: media.id, title, date: dateKey(media.startDate), type: 'CURRENT' }, ...relations]
    .filter(entry => Number.isFinite(entry.date))
    .sort((left, right) => left.date - right.date || left.title.localeCompare(right.title));
  const currentIndex = Math.max(0, timeline.findIndex(entry => entry.id === media.id));
  const franchiseRoot = timeline[0]?.title || title;

  return normalizeItem({
    id: `anilist-${media.id}-${uid()}`,
    anilistId: media.id,
    title,
    status: 'planned',
    season: 1,
    episode: 0,
    totalEpisodes: media.episodes || null,
    episodesLogged: 0,
    mediaType: media.format?.includes('MOVIE') ? 'movie' : 'series',
    franchise: franchiseRoot,
    seriesOrder: currentIndex + 1,
    chronologyKey: dateKey(media.startDate),
    accent: media.coverImage?.color || ACCENTS[index % ACCENTS.length],
    coverImage: media.coverImage?.extraLarge || media.coverImage?.large || '',
    startDate: media.startDate,
    relationOrder: timeline,
    source: 'anilist',
    updatedAt: now()
  });
}

export async function fetchAniList(search, fetchImpl = fetchImplementation) {
  const query = `query ($search: String) {
    Page(page: 1, perPage: 12) {
      media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
        id title { romaji english native } episodes format season seasonYear
        startDate { year month day } coverImage { extraLarge large color } siteUrl
        relations { edges { relationType node { id title { romaji english } format startDate { year month day } } } }
      }
    }
  }`;
  const response = await fetchImpl(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables: { search } })
  });
  if (!response.ok) throw new Error(`AniList returned ${response.status}`);
  const payload = await response.json();
  if (payload.errors) throw new Error(payload.errors[0]?.message || 'AniList search failed');
  return (payload.data?.Page?.media || []).map(externalToItem);
}

export function externalCard(item) {
  const safeCover = String(item.coverImage || '').replace(/'/g, '%27');
  const artStyle = safeCover
    ? `background-image:linear-gradient(180deg,rgba(4,4,15,.02),rgba(4,4,15,.92)),url('${escapeHtml(safeCover)}')`
    : '';
  const year = item.startDate?.year || 'Unknown year';
  return `<article class="anime-card external-card" style="--accent:${escapeHtml(item.accent)}" data-external-id="${escapeHtml(item.anilistId)}">
    <div class="card-art" style="${artStyle}"><span class="card-rune">＋</span><span class="status-pill">ANILIST</span></div>
    <div class="card-body"><h3>${escapeHtml(item.title)}</h3><div class="card-meta">${escapeHtml(String(year))} • ${item.totalEpisodes || '?'} episodes</div>
    <div class="progress-track"><span style="width:0%"></span></div><div class="card-meta">${item.relationOrder.length ? `${item.relationOrder.length} connected franchise titles found` : 'Standalone or relation data unavailable'}</div>
    <div class="card-actions"><button class="episode-plus" data-action="add-planned">ADD TO NOT STARTED</button><button data-action="add-watching">EP 1</button></div></div>
  </article>`;
}

export async function runSearch(query, { fetchImpl = fetchImplementation } = {}) {
  const text = String(query || '').trim();
  const state = getState();
  state.view = 'search';
  saveState('search-view');
  requestRender();
  const summary = $('#searchSummary');
  const resultsRoot = $('#searchResults');
  if (!summary || !resultsRoot) return [];
  if (!text) {
    summary.textContent = 'Type an anime title to search your library and the anime database.';
    resultsRoot.innerHTML = '';
    return [];
  }

  const normalized = text.toLowerCase();
  const profile = activeProfile();
  const local = profile.items.filter(item => `${item.title} ${item.franchise}`.toLowerCase().includes(normalized));
  summary.textContent = `Found ${local.length} saved match${local.length === 1 ? '' : 'es'}. Searching the anime universe…`;
  resultsRoot.innerHTML = local.map(item => animeCard(item, profile.id)).join('')
    || '<div class="empty-state"><div class="empty-orb">⌕</div><h3>No saved matches yet.</h3><p>Checking the online anime database…</p></div>';

  const requestId = ++searchRequest;
  try {
    const online = await fetchAniList(text, fetchImpl);
    if (requestId !== searchRequest) return [];
    externalResults = online;
    const savedIds = new Set(activeProfile().items.map(item => item.anilistId).filter(Boolean));
    const outside = online.filter(item => !savedIds.has(item.anilistId));
    summary.textContent = `${local.length} saved match${local.length === 1 ? '' : 'es'} • ${outside.length} database result${outside.length === 1 ? '' : 's'}`;
    resultsRoot.innerHTML = local.map(item => animeCard(item, activeProfile().id)).join('')
      + outside.map(externalCard).join('')
      || '<div class="empty-state"><div class="empty-orb">?</div><h3>No anime found.</h3><p>Try a shorter title or alternate spelling.</p></div>';
    return outside;
  } catch (error) {
    console.error(error);
    summary.textContent = `${local.length} saved match${local.length === 1 ? '' : 'es'} • online search unavailable right now`;
    if (!local.length) {
      resultsRoot.innerHTML = '<div class="empty-state"><div class="empty-orb">!</div><h3>Online search could not connect.</h3><p>Your saved lists still work offline.</p></div>';
    }
    return [];
  }
}

export function addExternal(anilistId, startWatching = false) {
  const source = externalResults.find(item => String(item.anilistId) === String(anilistId));
  if (!source) return null;
  const profile = activeProfile();
  if (profile.items.some(item => item.anilistId === source.anilistId || item.title.toLowerCase() === source.title.toLowerCase())) {
    showToast(`${source.title} is already in your list.`);
    return null;
  }
  const item = normalizeItem({
    ...clone(source),
    id: uid(),
    status: startWatching ? 'watching' : 'planned',
    episode: startWatching ? 1 : 0,
    episodesLogged: startWatching ? 1 : 0,
    updatedAt: now()
  });
  profile.items.push(item);
  if (startWatching) updateStreak();
  saveState('add-search-result');
  showToast(startWatching ? `${source.title} started at S1 E1.` : `${source.title} added to not started.`);
  runSearch($('#globalSearch')?.value || source.title);
  return item;
}

export function bindSearchEvents() {
  if (document.documentElement.dataset.knCoreSearchBound) return;
  document.documentElement.dataset.knCoreSearchBound = '1';
  const box = $('#rubberSearch');
  const input = $('#globalSearch');
  const punch = $('#searchPunch');
  if (!box || !input || !punch) return;

  punch.addEventListener('click', () => {
    const luffyOwnsOpening = Boolean(box.dataset.luffyArmV35) && !box.classList.contains('open');
    if (luffyOwnsOpening) return;
    if (!box.classList.contains('open')) {
      box.classList.add('open');
      window.setTimeout(() => input.focus(), 250);
    } else {
      runSearch(input.value);
    }
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') runSearch(event.target.value);
    if (event.key === 'Escape' && !box.dataset.luffyArmV35) {
      box.classList.remove('open');
      event.target.blur();
    }
  });

  document.addEventListener('click', event => {
    const card = event.target.closest('.anime-card[data-external-id]');
    if (!card) return;
    const action = event.target.closest('[data-action]')?.dataset.action;
    addExternal(card.dataset.externalId, action === 'add-watching');
  });
}

export function setExternalResultsForTest(results) {
  externalResults = results;
}
