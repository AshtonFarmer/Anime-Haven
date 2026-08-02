import { ANIME_META, ANIME_SEED } from './data/library-seed.js';
import { activeProfile, getState, loadState, saveState } from './store.js';
import {
  bindLibraryEvents,
  configureLibrary,
  renderHome,
  renderList,
  renderProfiles
} from './library.js';
import { bindSearchEvents, configureSearch } from './search.js';
import { bindSettingsEvents, renderSettings } from './settings.js';
import { installNavigationGuard } from './nav.js';
import { installPerformanceRuntime } from './performance.js';
import { installUpNext, renderUpNext } from './up-next.js';
import { installUpdates } from './updates.js';
import { $, $$, safeScrollToTop } from './utils.js';

export const CORE_VERSION = '2.0.0-beta.1';
let initialized = false;
let featuresPromise = null;

export function setView(view, options = {}) {
  const state = getState();
  if (view === 'watched' || view === 'planned') {
    state.listMode = view;
    state.view = 'list';
  } else {
    state.view = view;
  }
  if (options.filter) state.filter = options.filter;
  saveState('view');
  renderApp();
  safeScrollToTop();
}

export function updateSwordScroll() {
  const sword = $('#swordScroll');
  if (!sword) return;
  const scrollable = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const progress = Math.min(1, scrollY / scrollable);
  const minimum = 86;
  const maximum = Math.max(minimum, innerHeight - 250);
  sword.style.top = `${minimum + progress * (maximum - minimum)}px`;
}

export function renderApp() {
  const state = getState();
  const currentView = state.view === 'list' ? 'list' : state.view;
  $$('.view').forEach(view => view.classList.toggle('active', view.dataset.viewName === currentView));
  $$('.bottom-nav button').forEach(button => {
    const target = button.dataset.view;
    const active = (target === 'watched' && state.view === 'list' && state.listMode === 'watched')
      || (target === 'planned' && state.view === 'list' && state.listMode === 'planned')
      || target === state.view;
    button.classList.toggle('active', active);
  });
  renderProfiles();
  renderHome();
  renderUpNext();
  if (state.view === 'list') renderList();
  if (state.view === 'settings') renderSettings();
  updateSwordScroll();
}

function chargeButton(button, target) {
  let fired = false;
  const timer = window.setTimeout(() => {
    fired = true;
    button.classList.add('charging');
    window.setTimeout(() => {
      $('#screenFlash')?.classList.add('burst');
      window.setTimeout(() => $('#screenFlash')?.classList.remove('burst'), 750);
      button.classList.remove('charging');
      setView(target);
    }, 520);
  }, 450);
  const cancel = () => {
    window.clearTimeout(timer);
    if (!fired) setView(target);
    button.removeEventListener('pointerup', cancel);
    button.removeEventListener('pointercancel', cancel);
    button.removeEventListener('pointerleave', cancel);
  };
  button.addEventListener('pointerup', cancel, { once: true });
  button.addEventListener('pointercancel', cancel, { once: true });
  button.addEventListener('pointerleave', cancel, { once: true });
}

function bindRoutingEvents() {
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-view]');
    if (!button) return;
    const view = button.dataset.view;
    if (view) setView(view);
  });
  $$('.power-card').forEach(button => button.addEventListener('pointerdown', event => {
    event.preventDefault();
    chargeButton(button, button.dataset.target);
  }));
  window.addEventListener('scroll', updateSwordScroll, { passive: true });
  window.addEventListener('resize', updateSwordScroll, { passive: true });
}

export function setupStarfield() {
  const canvas = $('#starfield');
  const context = canvas?.getContext?.('2d');
  if (!canvas || !context) return () => {};
  let stars = [];
  let frame = 0;
  const resize = () => {
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars = Array.from({ length: Math.min(150, Math.round(innerWidth * innerHeight / 9000)) }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: Math.random() * 1.3 + .2,
      alpha: Math.random() * .7 + .15,
      speed: Math.random() * .012 + .003
    }));
  };
  const draw = time => {
    const paused = document.hidden || document.documentElement.dataset.knPerformanceMode === 'low';
    if (!paused) {
      context.clearRect(0, 0, innerWidth, innerHeight);
      stars.forEach((star, index) => {
        const alpha = star.alpha * (.58 + Math.sin(time * star.speed + index) * .42);
        context.fillStyle = `rgba(211,236,255,${alpha})`;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      });
    }
    frame = requestAnimationFrame(draw);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });
  frame = requestAnimationFrame(draw);
  const cleanup = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
  };
  window.addEventListener('pagehide', cleanup, { once: true });
  return cleanup;
}

function exposeCompatibilityGlobals() {
  window.ANIME_HAVEN_SEED = ANIME_SEED;
  window.ANIME_HAVEN_META = ANIME_META;
  window.KageNexus = Object.freeze({
    version: CORE_VERSION,
    storageKey: 'anime-haven-state-v2',
    getState,
    activeProfile,
    render: renderApp,
    setView
  });
}

async function importIndependentFeatures() {
  const results = await Promise.allSettled([
    import('./arsenal.js'),
    import('../luffy-search-v35.js'),
    import('../library-manager-v15.js'),
    import('../library-dialog-sync-v61.js'),
    import('./mobile.js'),
    import('../arsenal-personal-v62.js')
  ]);
  results.forEach(result => {
    if (result.status === 'rejected') console.error('A KageNexus feature module could not load', result.reason);
  });
  window.dispatchEvent(new CustomEvent('kagenexus-ready', { detail: { version: CORE_VERSION } }));
  window.dispatchEvent(new CustomEvent('anime-haven-ready', { detail: { version: CORE_VERSION } }));
  const loadTransformEffects = () => import('../assets/js/power-transform-v29.js')
    .catch(error => console.error('KageNexus power effects could not load', error));
  if ('requestIdleCallback' in window) requestIdleCallback(loadTransformEffects, { timeout: 1200 });
  else window.setTimeout(loadTransformEffects, 0);
}

function removeBootSplash() {
  const splash = document.getElementById('bootSplash');
  if (!splash) return;
  splash.classList.add('is-complete');
  window.setTimeout(() => splash.remove(), 260);
}

export function bootstrapApp({ loadFeatures = true, setupAnimations = true } = {}) {
  if (initialized) return { state: getState(), featuresReady: featuresPromise };
  initialized = true;
  exposeCompatibilityGlobals();
  loadState();
  configureLibrary({ render: renderApp });
  configureSearch({ render: renderApp });
  bindRoutingEvents();
  bindLibraryEvents();
  bindSearchEvents();
  bindSettingsEvents();
  installNavigationGuard();
  installPerformanceRuntime();
  installUpNext();
  if (setupAnimations) setupStarfield();
  renderApp();
  removeBootSplash();

  if (loadFeatures) {
    featuresPromise = importIndependentFeatures();
    installUpdates();
  } else {
    featuresPromise = Promise.resolve();
  }
  return { state: getState(), featuresReady: featuresPromise };
}

if (typeof document !== 'undefined' && !globalThis.__KAGENEXUS_DISABLE_AUTO_START__) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => bootstrapApp(), { once: true });
  } else {
    bootstrapApp();
  }
}
