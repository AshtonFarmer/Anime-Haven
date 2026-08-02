const STORAGE_KEY = 'kagenexus-performance-mode';
const MODES = new Set(['full', 'balanced', 'low']);
const MODE_COPY = {
  full: 'All visual effects and animations stay enabled.',
  balanced: 'Keeps the KageNexus look while reducing unnecessary background work.',
  low: 'Cuts most decorative motion and pauses extra media to save battery and memory.'
};

let mode = 'balanced';

function readMode() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (MODES.has(saved)) return saved;
  } catch {}
  if (navigator.connection?.saveData) return 'low';
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'low' : 'balanced';
}

function pauseMedia() {
  document.querySelectorAll('video,audio').forEach(media => {
    if (!media.paused) {
      media.dataset.kn62WasPlaying = '1';
      media.pause();
    }
  });
}

function pauseHeavyFrames() {
  document.querySelectorAll('#arsenalView iframe[data-arsenal-media-src][src]').forEach(frame => {
    frame.dataset.kn62PausedFrame = '1';
    frame.removeAttribute('src');
    frame.closest('.arsenal-media-shell')?.classList.remove('media-loaded', 'media-failed');
  });
}

function restoreHeavyFrames() {
  document.querySelectorAll('#arsenalView iframe[data-kn62-paused-frame="1"]').forEach(frame => {
    const source = frame.dataset.arsenalMediaSrc;
    delete frame.dataset.kn62PausedFrame;
    if (!source) return;
    const shell = frame.closest('.arsenal-media-shell');
    frame.onload = () => {
      shell?.classList.add('media-loaded');
      shell?.classList.remove('media-failed');
    };
    frame.onerror = () => {
      shell?.classList.add('media-failed');
      shell?.classList.remove('media-loaded');
    };
    frame.dataset.arsenalMediaLoaded = '1';
    frame.src = source;
  });
}

export function applyPerformanceMode(next) {
  mode = MODES.has(next) ? next : 'balanced';
  document.documentElement.dataset.knPerformanceMode = mode;
  try { localStorage.setItem(STORAGE_KEY, mode); } catch {}
  if (mode === 'low') pauseMedia();
  window.dispatchEvent(new CustomEvent('kagenexus-performance-mode', { detail: { mode } }));
  document.querySelectorAll('[data-kn62-performance-option]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.kn62PerformanceOption === mode));
  });
  const current = document.getElementById('kn62PerformanceCurrent');
  if (current) current.textContent = MODE_COPY[mode];
}

export function installPerformanceSettings() {
  const grid = document.querySelector('#settingsView .settings-grid');
  if (!grid) return false;
  let card = document.getElementById('kn62PerformanceSettings');
  if (!card) {
    card = document.createElement('article');
    card.id = 'kn62PerformanceSettings';
    card.className = 'glass-panel settings-card full-span kn62-performance-card';
    card.innerHTML = `<h3>Performance mode</h3>
      <p>Choose how much animation and background work KageNexus should use on this device.</p>
      <div class="kn62-performance-options" role="group" aria-label="KageNexus performance mode">
        <button type="button" data-kn62-performance-option="full">Full Effects</button>
        <button type="button" data-kn62-performance-option="balanced">Balanced</button>
        <button type="button" data-kn62-performance-option="low">Low Power</button>
      </div><p class="kn62-performance-current" id="kn62PerformanceCurrent"></p>`;
    grid.prepend(card);
    card.addEventListener('click', event => {
      const button = event.target.closest('[data-kn62-performance-option]');
      if (button) applyPerformanceMode(button.dataset.kn62PerformanceOption);
    });
  }
  applyPerformanceMode(mode);
  return true;
}

export function installPerformanceRuntime() {
  mode = readMode();
  document.documentElement.dataset.knPerformanceMode = mode;
  installPerformanceSettings();
  document.addEventListener('visibilitychange', () => {
    document.documentElement.toggleAttribute('data-kn-page-hidden', document.hidden);
    if (document.hidden) {
      pauseMedia();
      pauseHeavyFrames();
    } else {
      restoreHeavyFrames();
    }
  });
  window.addEventListener('pagehide', () => {
    pauseMedia();
    pauseHeavyFrames();
  }, { once: true });
}
