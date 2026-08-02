import {
  activeProfile,
  findItem,
  getState,
  saveState,
  updateStreak
} from './store.js';
import { $, $$, escapeHtml, formatDate, now, showToast } from './utils.js';

let requestRender = () => {};
let listSignature = '';

export function configureLibrary({ render } = {}) {
  if (render) requestRender = render;
}

export function statusLabel(item) {
  if (item.status === 'planned') return 'Not started';
  if (item.status === 'completed') return 'Completed';
  return 'In progress';
}

export function seasonEpisode(item) {
  if (item.mediaType === 'movie') return item.status === 'completed' ? 'Movie watched' : 'Movie not watched';
  const season = item.season > 0 ? `Season ${item.season}` : 'Special';
  return `${season} • Episode ${item.episode}`;
}

export function progressPercent(item) {
  if (item.status === 'completed') return 100;
  if (item.totalEpisodes) return Math.min(100, Math.round((item.episode / item.totalEpisodes) * 100));
  if (item.episode === 0) return 0;
  return Math.min(92, 12 + item.episode * 3);
}

export function animeCard(item, profileId, options = {}) {
  const percent = progressPercent(item);
  const actionText = item.status === 'planned'
    ? 'WATCH EP 1'
    : item.status === 'completed' ? 'OPEN' : '+1 EPISODE';
  const safeCover = String(item.coverImage || '').replace(/'/g, '%27');
  const artStyle = safeCover
    ? `background-image:linear-gradient(180deg,rgba(4,4,15,.05),rgba(4,4,15,.9)),url('${escapeHtml(safeCover)}')`
    : '';
  const badge = options.profileName
    ? `<span class="status-pill">${escapeHtml(options.profileName)}</span>`
    : `<span class="status-pill">${statusLabel(item)}</span>`;

  return `<article class="anime-card ${item.coverImage ? 'external-card' : ''}" style="--accent:${escapeHtml(item.accent)}" data-item-id="${escapeHtml(item.id)}" data-profile-id="${escapeHtml(profileId)}">
    <div class="card-art" style="${artStyle}">
      <span class="card-rune">${escapeHtml((item.title.match(/[A-Z0-9]/i)?.[0] || '影').toUpperCase())}</span>${badge}
    </div>
    <div class="card-body">
      <h3>${escapeHtml(item.title)}</h3>
      <div class="card-meta">${escapeHtml(seasonEpisode(item))}</div>
      <div class="progress-track"><span style="width:${percent}%"></span></div>
      <div class="card-meta">${escapeHtml(item.franchise)}${item.franchise !== item.title ? ` • order ${item.seriesOrder || 1}` : ''}</div>
      <div class="card-actions">
        <button class="episode-plus" data-action="plus-episode">${actionText}</button>
        <button data-action="details" aria-label="Edit details">•••</button>
      </div>
    </div>
  </article>`;
}

export function renderProfiles() {
  const profile = activeProfile();
  const name = $('#profileName');
  const avatar = $('#profileAvatar');
  if (name) name.textContent = profile.name;
  if (avatar) avatar.textContent = (profile.name[0] || '?').toUpperCase();
}

export function renderHome() {
  const state = getState();
  const items = activeProfile(state).items;
  const watched = items.filter(item => item.status !== 'planned');
  const planned = items.filter(item => item.status === 'planned');
  const watchedCount = $('#watchedCount');
  const plannedCount = $('#plannedCount');
  const episodeTotal = $('#episodeTotal');
  const completedTotal = $('#completedTotal');
  const streakTotal = $('#streakTotal');
  if (watchedCount) watchedCount.textContent = `${watched.length} title${watched.length === 1 ? '' : 's'}`;
  if (plannedCount) plannedCount.textContent = `${planned.length} title${planned.length === 1 ? '' : 's'}`;
  if (episodeTotal) episodeTotal.textContent = watched
    .reduce((sum, item) => sum + Number(item.episodesLogged || 0), 0)
    .toLocaleString();
  if (completedTotal) completedTotal.textContent = watched.filter(item => item.status === 'completed').length;
  if (streakTotal) streakTotal.textContent = `${state.streak.days || 0} day${state.streak.days === 1 ? '' : 's'}`;
}

export function listItems(state = getState()) {
  let items = activeProfile(state).items.filter(item => (
    state.listMode === 'planned' ? item.status === 'planned' : item.status !== 'planned'
  ));
  if (state.listMode === 'watched' && state.filter !== 'all') {
    items = items.filter(item => item.status === state.filter);
  }
  const sorted = [...items];
  if (state.sort === 'alpha') sorted.sort((left, right) => left.title.localeCompare(right.title));
  if (state.sort === 'recent') sorted.sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
  if (state.sort === 'chronology') {
    sorted.sort((left, right) => {
      const franchise = left.franchise.localeCompare(right.franchise);
      if (franchise) return franchise;
      return (left.chronologyKey || left.seriesOrder || 1) - (right.chronologyKey || right.seriesOrder || 1)
        || left.title.localeCompare(right.title);
    });
  }
  return sorted;
}

export function renderList({ force = false } = {}) {
  const state = getState();
  const planned = state.listMode === 'planned';
  const eyebrow = $('#listEyebrow');
  const title = $('#listTitle');
  if (eyebrow) eyebrow.textContent = planned ? 'UNCHARTED REALM' : 'ACTIVE ARCHIVE';
  if (title) title.textContent = planned ? 'Haven’t Started Yet' : 'Watched + In Progress';

  const filters = planned
    ? [{ id: 'all', label: 'All unstarted' }]
    : [
        { id: 'all', label: 'All' },
        { id: 'watching', label: 'In progress' },
        { id: 'completed', label: 'Completed' }
      ];
  const filterRoot = $('#statusFilters');
  if (filterRoot) {
    filterRoot.innerHTML = filters.map(filter => (
      `<button class="${state.filter === filter.id ? 'active' : ''}" data-filter="${filter.id}">${filter.label}</button>`
    )).join('');
  }
  const sort = $('#sortSelect');
  if (sort) sort.value = state.sort;

  const items = listItems(state);
  const signature = [
    state.listMode,
    state.filter,
    state.sort,
    ...items.map(item => [item.id, item.status, item.season, item.episode, item.updatedAt].join(':'))
  ].join('|');
  const grid = $('#animeGrid');
  if (grid && (force || signature !== listSignature)) {
    grid.innerHTML = items.map(item => animeCard(item, state.activeProfileId)).join('');
    listSignature = signature;
  }
  $('#emptyState')?.classList.toggle('hidden', items.length > 0);
}

export function openDialog(profileId, itemId) {
  const { profile, item } = findItem(profileId, itemId);
  if (!profile || !item) return;
  const dialog = $('#animeDialog');
  if (!dialog) return;
  const history = item.seasonHistory.length
    ? item.seasonHistory.map(entry => `S${entry.season}: ${entry.episodes} eps`).join(' • ')
    : 'No finished-season history yet.';
  $('#dialogContent').innerHTML = `<div class="dialog-hero" style="--accent:${escapeHtml(item.accent)}">
    <p class="eyebrow">${escapeHtml(profile.name)} • ${escapeHtml(statusLabel(item))}</p>
    <h2>${escapeHtml(item.title)}</h2>
  </div>
  <div class="dialog-body" data-dialog-profile="${escapeHtml(profileId)}" data-dialog-item="${escapeHtml(itemId)}">
    <div class="progress-editor">
      <div class="progress-box"><label>Current season / volume</label><div class="counter"><button data-counter="season" data-delta="-1">−</button><input id="seasonInput" type="number" min="0" value="${item.season}"><button data-counter="season" data-delta="1">+</button></div></div>
      <div class="progress-box"><label>Current episode</label><div class="counter"><button data-counter="episode" data-delta="-1">−</button><input id="episodeInput" type="number" min="0" value="${item.episode}"><button data-counter="episode" data-delta="1">+</button></div></div>
      <div class="progress-box"><label>Episodes in this season (optional)</label><input id="totalEpisodesInput" type="number" min="1" placeholder="Unknown" value="${item.totalEpisodes || ''}"></div>
      <div class="progress-box"><label>Series / franchise order</label><input id="seriesOrderInput" type="number" min="1" value="${item.seriesOrder || 1}"></div>
    </div>
    <div class="chronology-box"><strong>Season history:</strong> ${escapeHtml(history)}<br><small>${escapeHtml(item.progressNote || `Updated ${formatDate(item.updatedAt)}`)}</small></div>
    <div class="dialog-actions">
      <button class="action-button" data-dialog-action="save">Save progress</button>
      <button class="action-button secondary" data-dialog-action="plus">+1 episode</button>
      <button class="action-button secondary" data-dialog-action="finish-season">Finish season → next season</button>
      <button class="action-button secondary" data-dialog-action="complete">Mark title complete</button>
      <button class="action-button secondary" data-dialog-action="planned">Move to not started</button>
      <button class="action-button danger-button" data-dialog-action="remove">Remove</button>
    </div>
  </div>`;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

export function commitDialogValues(profileId, itemId) {
  const { item } = findItem(profileId, itemId);
  if (!item) return null;
  const oldEpisode = item.episode;
  item.season = Math.max(0, Number($('#seasonInput')?.value || 0));
  item.episode = Math.max(0, Number($('#episodeInput')?.value || 0));
  item.totalEpisodes = Number($('#totalEpisodesInput')?.value) > 0
    ? Number($('#totalEpisodesInput').value)
    : null;
  item.seriesOrder = Math.max(1, Number($('#seriesOrderInput')?.value || 1));
  item.chronologyKey = item.seriesOrder;
  item.episodesLogged = Math.max(0, item.episodesLogged + (item.episode - oldEpisode));
  if (item.episode > 0 && item.status === 'planned') item.status = 'watching';
  item.updatedAt = now();
  saveState('dialog-progress');
  return item;
}

export function addEpisode(profileId, itemId) {
  const { item } = findItem(profileId, itemId);
  if (!item) return null;
  if (item.status === 'completed') {
    openDialog(profileId, itemId);
    return item;
  }
  if (item.status === 'planned') item.status = 'watching';
  if (item.mediaType === 'movie') {
    item.episode = 1;
    item.episodesLogged += 1;
    item.status = 'completed';
  } else {
    item.episode += 1;
    item.episodesLogged += 1;
    if (item.totalEpisodes && item.episode >= item.totalEpisodes) {
      showToast(`Season ${item.season} is ready to finish.`);
    }
  }
  item.updatedAt = now();
  updateStreak();
  saveState('episode-plus');
  listSignature = '';
  requestRender();
  return item;
}

function closeDialog() {
  const dialog = $('#animeDialog');
  if (!dialog) return;
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

export function bindLibraryEvents() {
  if (document.documentElement.dataset.knCoreLibraryBound) return;
  document.documentElement.dataset.knCoreLibraryBound = '1';

  document.addEventListener('click', event => {
    const card = event.target.closest('.anime-card');
    if (!card || card.dataset.externalId) return;
    const profileId = card.dataset.profileId;
    const itemId = card.dataset.itemId;
    if (!profileId || !itemId) return;
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'plus-episode') addEpisode(profileId, itemId);
    else openDialog(profileId, itemId);
  });

  $('#statusFilters')?.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    getState().filter = button.dataset.filter;
    saveState('filter');
    listSignature = '';
    renderList();
  });
  $('#sortSelect')?.addEventListener('change', event => {
    getState().sort = event.target.value;
    saveState('sort');
    listSignature = '';
    renderList();
  });

  $('.dialog-close')?.addEventListener('click', closeDialog);
  $('#animeDialog')?.addEventListener('click', event => {
    const dialog = $('#animeDialog');
    if (event.target === dialog) closeDialog();
    const root = event.target.closest('[data-dialog-profile]');
    if (!root) return;
    const profileId = root.dataset.dialogProfile;
    const itemId = root.dataset.dialogItem;
    const counter = event.target.closest('[data-counter]');
    if (counter) {
      const input = counter.dataset.counter === 'season' ? $('#seasonInput') : $('#episodeInput');
      input.value = Math.max(0, Number(input.value || 0) + Number(counter.dataset.delta));
      return;
    }
    const action = event.target.closest('[data-dialog-action]')?.dataset.dialogAction;
    if (!action) return;
    const { profile, item } = findItem(profileId, itemId);
    if (!profile || !item) return;

    if (action === 'save') {
      commitDialogValues(profileId, itemId);
      closeDialog();
      requestRender();
      showToast('Progress saved.');
    } else if (action === 'plus') {
      commitDialogValues(profileId, itemId);
      addEpisode(profileId, itemId);
      openDialog(profileId, itemId);
    } else if (action === 'finish-season') {
      commitDialogValues(profileId, itemId);
      item.seasonHistory.push({ season: item.season, episodes: item.episode, finishedAt: now() });
      item.completedSeasons = Math.max(item.completedSeasons, item.season);
      item.season += 1;
      item.episode = 0;
      item.totalEpisodes = null;
      item.status = 'watching';
      item.updatedAt = now();
      updateStreak();
      saveState('finish-season');
      listSignature = '';
      closeDialog();
      requestRender();
      showToast(`Season ${item.season - 1} finished. Season ${item.season} is ready.`);
    } else if (action === 'complete') {
      commitDialogValues(profileId, itemId);
      item.status = 'completed';
      item.updatedAt = now();
      saveState('complete-title');
      listSignature = '';
      closeDialog();
      requestRender();
      showToast(`${item.title} marked complete.`);
    } else if (action === 'planned') {
      item.status = 'planned';
      item.updatedAt = now();
      saveState('move-planned');
      listSignature = '';
      closeDialog();
      requestRender();
      showToast(`${item.title} moved to not started. Progress was kept.`);
    } else if (action === 'remove') {
      profile.items = profile.items.filter(entry => entry.id !== item.id);
      saveState('remove-title');
      listSignature = '';
      closeDialog();
      requestRender();
      showToast(`${item.title} removed.`);
    }
  });
}

export function invalidateLibraryRender() {
  listSignature = '';
}
