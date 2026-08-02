const CACHE = 'kagenexus-v63-core-beta';
const CORE = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest?release=63-core-beta',
  './icons/kagenexus-favicon-v19.svg?release=63-core-beta',
  './icons/kagenexus-icon.png?release=63-core-beta',
  './styles/core.css?release=63-core-beta',
  './styles/mobile.css?release=63-core-beta',
  './styles/runtime.css?release=63-core-beta',
  './library-manager-v14.css?release=63-core-beta',
  './arsenal-v34.css?release=63-core-beta',
  './luffy-search-v35.css?release=63-core-beta',
  './assets/css/power-transform-v29.css?release=63-core-beta',
  './src/app.js?release=63-core-beta',
  './src/utils.js',
  './src/store.js',
  './src/library.js',
  './src/search.js',
  './src/settings.js',
  './src/config.js',
  './src/nav.js',
  './src/performance.js',
  './src/up-next.js',
  './src/updates.js',
  './src/mobile.js',
  './src/arsenal.js',
  './src/data/library-seed.js',
  './src/data/library-seed-release62.js',
  './src/data/arsenal-items.js',
  './luffy-search-v35.js',
  './library-manager-v15.js',
  './library-dialog-sync-v61.js',
  './arsenal-personal-v62.js',
  './rubber-search-v11.js?release=11',
  './rubber-search-v11.css?release=11',
  './rubber-search-compact-v12.js?release=12',
  './rubber-search-compact-v12.css?release=12',
  './assets/js/power-transform-v29.js',
  './assets/media/luffy-search/luffy-arm-open-v35.webp?release=35',
  './assets/media/luffy-search/luffy-arm-close-v35.webp?release=35',
  './assets/media/luffy-search/luffy-arm-coiled-v35.webp?release=35',
  './assets/media/luffy-search/luffy-arm-search-v35.webp?release=35',
  './assets/arsenal/media-sources.json'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const results = await Promise.allSettled(CORE.map(url => cache.add(url)));
    results.forEach((result, index) => {
      if (result.status === 'rejected') console.warn('KageNexus cache skipped', CORE[index], result.reason);
    });
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('kagenexus-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

function remember(event, cache, request, response) {
  if (!response?.ok) return response;
  event.waitUntil(cache.put(request, response.clone()).catch(error => {
    console.warn('KageNexus cache write skipped', error);
  }));
  return response;
}

async function networkFirst(event, request, cache) {
  try {
    const response = await fetch(request);
    if (!response?.ok) throw new Error(`Navigation returned ${response?.status || 0}`);
    return remember(event, cache, request, response);
  } catch (error) {
    return await cache.match(request)
      || await cache.match('./index.html')
      || await cache.match('./offline.html')
      || Promise.reject(error);
  }
}

async function cacheFirst(event, request, cache) {
  const cached = await cache.match(request);
  if (cached) return cached;
  return remember(event, cache, request, await fetch(request));
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return request.mode === 'navigate'
      ? networkFirst(event, request, cache)
      : cacheFirst(event, request, cache);
  })());
});
