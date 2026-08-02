import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';

test('full modular runtime installs every Release 62 feature without packaged execution', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const dom = new JSDOM(html, { url: 'https://kagenexus.test/' });
  const { window } = dom;
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.HTMLCanvasElement.prototype.getContext = () => null;
  window.requestAnimationFrame = callback => window.setTimeout(() => callback(Date.now()), 0);
  window.cancelAnimationFrame = id => window.clearTimeout(id);
  if (window.HTMLDialogElement) {
    window.HTMLDialogElement.prototype.showModal = function showModal() { this.setAttribute('open', ''); };
    window.HTMLDialogElement.prototype.close = function close() {
      this.removeAttribute('open');
      this.dispatchEvent(new window.Event('close'));
    };
  }

  const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.assign(globalThis, {
    window,
    document: window.document,
    location: window.location,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    CustomEvent: window.CustomEvent,
    Event: window.Event,
    Element: window.Element,
    HTMLElement: window.HTMLElement,
    Document: window.Document,
    DocumentFragment: window.DocumentFragment,
    Node: window.Node,
    MutationObserver: window.MutationObserver,
    DOMParser: window.DOMParser,
    innerWidth: 1200,
    innerHeight: 800,
    scrollY: 0,
    requestAnimationFrame: window.requestAnimationFrame,
    cancelAnimationFrame: window.cancelAnimationFrame,
    dispatchEvent: window.dispatchEvent.bind(window),
    addEventListener: window.addEventListener.bind(window),
    removeEventListener: window.removeEventListener.bind(window),
    getComputedStyle: window.getComputedStyle.bind(window),
    __KAGENEXUS_DISABLE_AUTO_START__: true
  });
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });

  const app = await import(`../src/app.js?full-runtime=${Date.now()}`);
  const { featuresReady } = app.bootstrapApp({ loadFeatures: true, setupAnimations: false });
  await featuresReady;
  await new Promise(resolve => window.setTimeout(resolve, 20));

  assert.equal(document.documentElement.dataset.knMobileSuite, '22');
  assert.ok(document.documentElement.dataset.arsenalV59);
  assert.equal(document.documentElement.dataset.knSearchStyle, 'luffy');
  assert.ok(document.querySelector('#homeAddAnime'));
  assert.ok(document.querySelector('#arsenalView'));
  assert.equal(document.querySelectorAll('#arsenalGrid .arsenal-card').length, 0);
  assert.ok(document.querySelector('#kn35SearchStyleSettings'));
  assert.equal(document.querySelector('.bottom-nav [data-view="arsenal"]')?.textContent.trim().endsWith('Arsenal'), true);
  assert.equal(document.querySelectorAll('style').length, 0);

  dom.window.close();
  if (previousNavigator) Object.defineProperty(globalThis, 'navigator', previousNavigator);
});
