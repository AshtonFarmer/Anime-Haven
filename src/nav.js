const CONTROL_SELECTOR = [
  'button', 'a[href]', '[role="button"]', '[data-view]', '[data-route]',
  'input:not([type="range"])', 'textarea', 'select', 'label[for]', 'summary',
  '[contenteditable="true"]', '[tabindex]:not([tabindex="-1"])'
].join(',');

const MOVE_THRESHOLD = 8;
const CLICK_BLOCK_MS = 750;

const controlFor = target => target instanceof Element ? target.closest(CONTROL_SELECTOR) : null;

function markControls(root) {
  if (!(root instanceof Element || root instanceof Document || root instanceof DocumentFragment)) return;
  if (root instanceof Element && root.matches(CONTROL_SELECTOR)) root.classList.add('ah-scroll-safe-control');
  root.querySelectorAll?.(CONTROL_SELECTOR).forEach(control => control.classList.add('ah-scroll-safe-control'));
}

export function installNavigationGuard() {
  if (document.documentElement.dataset.appScrollGuardV14) return;
  document.documentElement.dataset.appScrollGuardV14 = '1';
  let trackedControl = null;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let suppressControl = null;
  let suppressUntil = 0;

  document.addEventListener('pointerdown', event => {
    trackedControl = controlFor(event.target);
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
  }, true);
  document.addEventListener('pointermove', event => {
    if (!trackedControl || moved) return;
    if (Math.hypot(event.clientX - startX, event.clientY - startY) >= MOVE_THRESHOLD) moved = true;
  }, true);
  const finish = () => {
    if (trackedControl && moved) {
      suppressControl = trackedControl;
      suppressUntil = performance.now() + CLICK_BLOCK_MS;
    }
    trackedControl = null;
    moved = false;
  };
  document.addEventListener('pointerup', finish, true);
  document.addEventListener('pointercancel', finish, true);
  document.addEventListener('click', event => {
    const control = controlFor(event.target);
    if (control && control === suppressControl && performance.now() < suppressUntil) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }, true);

  markControls(document);
  const observer = new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(markControls));
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
}
