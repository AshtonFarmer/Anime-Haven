export const RELEASE = '63-core-beta';
export const WORKER_URL = './sw-core.js?release=63-core-beta';
const LAST_RELEASE_KEY = 'kagenexus-last-seen-release';

let refreshing = false;
let updateCard = null;

function removeCard() {
  updateCard?.remove();
  updateCard = null;
}

function showCard({ title, message, worker, restart = false, timeout = 0 }) {
  removeCard();
  const card = document.createElement('aside');
  card.className = 'kn62-update-card';
  card.setAttribute('role', 'status');
  card.setAttribute('aria-live', 'polite');
  card.innerHTML = `<div class="kn62-update-copy"><strong></strong><span></span></div>
    <div class="kn62-update-actions">
      ${restart ? '<button class="kn62-update-dismiss" type="button">Later</button><button class="kn62-update-restart" type="button">Restart now</button>' : '<button class="kn62-update-dismiss" type="button">OK</button>'}
    </div>`;
  card.querySelector('strong').textContent = title;
  card.querySelector('span').textContent = message;
  card.querySelector('.kn62-update-dismiss')?.addEventListener('click', removeCard);
  card.querySelector('.kn62-update-restart')?.addEventListener('click', () => {
    if (!worker) return;
    card.querySelectorAll('button').forEach(button => { button.disabled = true; });
    card.querySelector('span').textContent = 'Installing the update…';
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
  document.body.appendChild(card);
  updateCard = card;
  if (timeout) window.setTimeout(() => { if (updateCard === card) removeCard(); }, timeout);
}

function watchRegistration(registration) {
  if (registration.waiting && navigator.serviceWorker.controller) {
    showCard({
      title: 'KageNexus update ready',
      message: 'Restart once to load the newest version without losing your library or progress.',
      worker: registration.waiting,
      restart: true
    });
  }
  registration.addEventListener('updatefound', () => {
    const worker = registration.installing;
    if (!worker) return;
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        showCard({
          title: 'KageNexus update ready',
          message: 'Restart once to load the newest version without losing your library or progress.',
          worker,
          restart: true
        });
      }
    });
  });
}

export async function installUpdates() {
  if (!('serviceWorker' in navigator)) return null;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });
  try {
    const registration = await navigator.serviceWorker.register(WORKER_URL, {
      scope: './',
      updateViaCache: 'none'
    });
    watchRegistration(registration);
    window.setTimeout(() => registration.update().catch(() => {}), 1200);
    let previous = '';
    try {
      previous = localStorage.getItem(LAST_RELEASE_KEY) || '';
      localStorage.setItem(LAST_RELEASE_KEY, RELEASE);
    } catch {}
    if (previous && previous !== RELEASE && !registration.waiting) {
      showCard({
        title: `KageNexus upgraded to ${RELEASE}`,
        message: 'The modular core and newest reliability improvements are active.',
        timeout: 6500
      });
    }
    return registration;
  } catch (error) {
    console.error('KageNexus update manager could not register the worker', error);
    return null;
  }
}
