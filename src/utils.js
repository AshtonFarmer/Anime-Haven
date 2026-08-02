export const $ = (selector, root = document) => root?.querySelector?.(selector) || null;
export const $$ = (selector, root = document) => [...(root?.querySelectorAll?.(selector) || [])];

export const clone = value => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

export const now = () => new Date().toISOString();

export const uid = () => globalThis.crypto?.randomUUID?.()
  || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const escapeHtml = value => String(value ?? '').replace(
  /[&<>'"]/g,
  character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]
);

export const normalizeTitle = value => String(value || '')
  .normalize('NFKD')
  .toLowerCase()
  .replace(/[’'×:–—\-]/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

export const formatDate = iso => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(iso));
  } catch {
    return 'Recently';
  }
};

let toastTimer = 0;

export function showToast(message, tone = 'default', timeout = 2800) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.tone = tone;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), timeout);
}

export function safeScrollToTop() {
  const behavior = document.documentElement.dataset.knPerformanceMode === 'low' ? 'auto' : 'smooth';
  try {
    window.scrollTo({ top: 0, behavior });
  } catch {
    window.scrollTo(0, 0);
  }
}
