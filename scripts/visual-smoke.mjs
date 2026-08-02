import fs from 'node:fs/promises';
import http from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chromium, { inflate } from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const root = path.resolve(import.meta.dirname, '..');
const output = path.resolve(process.argv[2] || '/tmp/kagenexus-visual');
const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp'
};

await fs.mkdir(output, { recursive: true });

const server = http.createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/') pathname = '/index.html';
    const target = path.resolve(root, `.${pathname}`);
    if (!target.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end();
      return;
    }
    const content = await fs.readFile(target);
    response.writeHead(200, {
      'content-type': contentTypes[path.extname(target)] || 'application/octet-stream',
      'cache-control': 'no-store'
    });
    response.end(content);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;
chromium.setGraphicsMode = false;
const chromiumModule = fileURLToPath(import.meta.resolve('@sparticuz/chromium'));
const chromiumArchive = path.resolve(path.dirname(chromiumModule), '..', 'bin', 'chromium.br');
const extractedChromium = path.join(tmpdir(), 'chromium');
const chromiumCache = path.join(tmpdir(), 'kagenexus-chromium-cache');
await fs.mkdir(chromiumCache, { recursive: true });
try {
  if ((await fs.stat(extractedChromium)).size < 1_000_000) await fs.rm(extractedChromium);
} catch {}
const executablePath = await inflate(chromiumArchive);
const browser = await puppeteer.launch({
  executablePath,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  ],
  env: { ...process.env, XDG_CACHE_HOME: chromiumCache },
  headless: 'shell',
  defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 }
});

const errors = [];
const attachDiagnostics = page => {
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', error => errors.push(`page: ${error.message}`));
  page.on('requestfailed', request => {
    if (new URL(request.url()).origin === origin) errors.push(`request: ${request.url()} — ${request.failure()?.errorText}`);
  });
};

async function waitForCore(page) {
  await page.waitForFunction(() => (
    Boolean(window.KageNexus)
    && document.documentElement.dataset.knMobileSuite === '22'
    && Boolean(document.getElementById('arsenalView'))
    && !document.getElementById('bootSplash')
  ), { timeout: 15000 });
}

async function settle(page, milliseconds = 450) {
  await page.evaluate(delay => new Promise(resolve => setTimeout(resolve, delay)), milliseconds);
}

try {
  const page = await browser.newPage();
  attachDiagnostics(page);
  await page.goto(origin, { waitUntil: 'domcontentloaded' });
  await waitForCore(page);
  await settle(page);
  await page.screenshot({ path: path.join(output, 'desktop-home.png') });

  const homeMetrics = await page.evaluate(() => ({
    elements: document.getElementsByTagName('*').length,
    arsenalCards: document.querySelectorAll('#arsenalGrid .arsenal-card').length,
    libraryItems: window.KageNexus.activeProfile().items.length,
    searchStyle: document.documentElement.dataset.knSearchStyle,
    performanceMode: document.documentElement.dataset.knPerformanceMode
  }));

  await page.click('.bottom-nav [data-view="watched"]');
  await page.waitForFunction(() => document.getElementById('listView')?.classList.contains('active'));
  await settle(page);
  await page.screenshot({ path: path.join(output, 'desktop-archive.png') });

  await page.click('.bottom-nav [data-view="planned"]');
  await page.waitForFunction(() => document.getElementById('listTitle')?.textContent.includes('Started'));
  await settle(page);
  await page.screenshot({ path: path.join(output, 'desktop-unstarted.png') });

  await page.click('#arsenalSettingsButton');
  await page.waitForFunction(() => document.getElementById('settingsView')?.classList.contains('active'));
  await settle(page);
  await page.screenshot({ path: path.join(output, 'desktop-settings.png') });

  await page.click('.bottom-nav [data-view="arsenal"]');
  await page.waitForFunction(() => document.querySelectorAll('#arsenalGrid .arsenal-card').length === 96);
  await settle(page);
  await page.screenshot({ path: path.join(output, 'desktop-arsenal.png') });

  const arsenalMetrics = await page.evaluate(() => ({
    cards: document.querySelectorAll('#arsenalGrid .arsenal-card').length,
    status: document.getElementById('arsenalLoadStatus')?.textContent,
    totalText: document.getElementById('arsenalResultCount')?.textContent
  }));

  const mobile = await browser.newPage();
  attachDiagnostics(mobile);
  await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await mobile.goto(origin, { waitUntil: 'domcontentloaded' });
  await waitForCore(mobile);
  await mobile.evaluate(() => window.KageNexus.setView('home'));
  await mobile.waitForFunction(() => document.getElementById('homeView')?.classList.contains('active'));
  await settle(mobile);
  await mobile.screenshot({ path: path.join(output, 'mobile-home.png') });
  const mobileHomeMetrics = await mobile.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    navHeight: document.querySelector('.bottom-nav')?.getBoundingClientRect().height,
    luffyWidth: document.getElementById('rubberSearch')?.getBoundingClientRect().width
  }));

  await mobile.click('.bottom-nav [data-view="arsenal"]');
  await mobile.waitForFunction(() => (
    document.getElementById('arsenalView')?.classList.contains('active')
    && document.querySelectorAll('#arsenalGrid .arsenal-card').length === 96
  ));
  await settle(mobile);
  await mobile.screenshot({ path: path.join(output, 'mobile-arsenal.png') });
  const mobileArsenalMetrics = await mobile.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    cards: document.querySelectorAll('#arsenalGrid .arsenal-card').length
  }));

  await page.evaluate(() => navigator.serviceWorker?.ready);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForCore(page);
  await page.setOfflineMode(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForCore(page);
  const offlineReady = await page.evaluate(() => Boolean(window.KageNexus && document.getElementById('homeView')));
  await page.setOfflineMode(false);

  if (homeMetrics.arsenalCards !== 0) throw new Error('Arsenal rendered cards during Home startup.');
  if (arsenalMetrics.cards !== 96) throw new Error('Arsenal did not honor its 96-card first page.');
  if (mobileHomeMetrics.horizontalOverflow || mobileArsenalMetrics.horizontalOverflow) {
    throw new Error('Mobile layout has horizontal overflow.');
  }
  if (!offlineReady) throw new Error('Offline service-worker reload did not restore the core.');
  if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);

  console.log(JSON.stringify({
    home: homeMetrics,
    arsenal: arsenalMetrics,
    mobile: { home: mobileHomeMetrics, arsenal: mobileArsenalMetrics },
    offlineReady,
    screenshots: output
  }, null, 2));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
