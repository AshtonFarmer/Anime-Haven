import { activeProfile, getState } from './store.js';
import { escapeHtml, normalizeTitle } from './utils.js';

let lastSignature = '';
let queued = false;

const progressText = item => {
  if (item.progressNote) return item.progressNote;
  if (item.mediaType === 'movie') return item.status === 'completed' ? 'Movie watched' : 'Movie not watched';
  return `Season ${Math.max(1, Number(item.season) || 1)} • Episode ${Math.max(0, Number(item.episode) || 0)}`;
};

function openItem(title) {
  const key = normalizeTitle(title);
  const heading = [...document.querySelectorAll('.anime-card h3,.external-card h3')]
    .find(node => normalizeTitle(node.textContent) === key);
  const card = heading?.closest('.anime-card,.external-card');
  if (card) {
    card.scrollIntoView?.({
      behavior: document.documentElement.dataset.knPerformanceMode === 'low' ? 'auto' : 'smooth',
      block: 'center'
    });
    window.setTimeout(() => card.click(), 180);
    return;
  }
  const input = document.getElementById('globalSearch');
  const punch = document.getElementById('searchPunch');
  if (!input) return;
  if (!document.getElementById('rubberSearch')?.classList.contains('open')) punch?.click();
  input.value = title;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.focus?.({ preventScroll: true });
}

export function renderUpNext({ force = false } = {}) {
  const home = document.getElementById('homeView');
  if (!home) return false;
  const items = activeProfile(getState()).items
    .filter(item => item.status === 'watching' && item.mediaType !== 'movie')
    .sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || '')))
    .slice(0, 3);
  const signature = items.map(item => [item.id, item.title, item.season, item.episode, item.updatedAt].join(':')).join('|');
  let section = document.getElementById('kn62UpNext');
  if (!items.length) {
    section?.remove();
    lastSignature = '';
    return true;
  }
  if (!force && section && signature === lastSignature) return true;
  if (!section) {
    section = document.createElement('section');
    section.id = 'kn62UpNext';
    section.className = 'kn62-up-next';
    const anchor = document.getElementById('homeAddAnime') || home.querySelector('.hero-copy');
    if (anchor) anchor.insertAdjacentElement('afterend', section);
    else home.prepend(section);
    section.addEventListener('click', event => {
      const button = event.target.closest('[data-kn62-up-next-title]');
      if (button) openItem(button.dataset.kn62UpNextTitle);
    });
  }
  section.innerHTML = `<div class="kn62-up-next-head"><div><p>CONTINUE YOUR JOURNEY</p><h2>Up Next</h2></div><span>${items.length} active title${items.length === 1 ? '' : 's'}</span></div>
    <div class="kn62-up-next-grid">${items.map(item => {
      const cover = item.coverImage ? `background-image:url('${String(item.coverImage).replace(/'/g, '%27')}')` : '';
      return `<button class="kn62-up-next-item" type="button" data-kn62-up-next-title="${escapeHtml(item.title)}"><span class="kn62-up-next-cover" style="${cover}"></span><span class="kn62-up-next-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(progressText(item))}</span><b>OPEN PROGRESS</b></span></button>`;
    }).join('')}</div>`;
  lastSignature = signature;
  return true;
}

export function scheduleUpNext() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    renderUpNext();
  });
}

export function installUpNext() {
  renderUpNext();
  window.addEventListener('kagenexus-state-change', scheduleUpNext);
}
