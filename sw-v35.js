const CACHE = 'kagenexus-v61-full-app-performance';
const CORE = [
  './',
  './index.html',
  './offline.html',
  './bootstrap-v4.js?release=61',
  './kagenexus-brand-v19.js?release=61',
  './luffy-search-v35.js?release=36',
  './luffy-search-v35.css?release=36',
  './rubber-search-v11.js?release=11',
  './rubber-search-v11.css?release=11',
  './rubber-search-compact-v12.js?release=12',
  './rubber-search-compact-v12.css?release=12',
  './assets/media/luffy-search/luffy-arm-open-v35.webp?release=35',
  './assets/media/luffy-search/luffy-arm-close-v35.webp?release=35',
  './assets/media/luffy-search/luffy-arm-coiled-v35.webp?release=35',
  './assets/media/luffy-search/luffy-arm-search-v35.webp?release=35',
  './nav-scroll-guard-v13.js?release=61',
  './library-manager-v15.js?release=61',
  './library-dialog-sync-v61.js?release=61',
  './library-manager-v14.css?release=15',
  './mobile-suite-loader-v22.js?release=61',
  './arsenal-v34.js?release=59',
  './arsenal-v34.css?release=59',
  './assets/arsenal/media-sources.json',
  './assets/css/power-transform-v29.css?release=33',
  './assets/js/power-transform-v29.js?release=33',
  './data/mobile-suite/mobile-suite-v22.part00?release=22',
  './data/mobile-suite/mobile-suite-v22.part01?release=22',
  './data/mobile-suite/mobile-suite-v22.part02?release=22',
  './data/mobile-suite/mobile-suite-v22.part03?release=22',
  './data/mobile-suite/mobile-suite-v22.part04?release=22',
  './data/mobile-suite/mobile-suite-v22.part05a?release=22',
  './data/mobile-suite/mobile-suite-v22.part05b?release=22',
  './data/mobile-suite/mobile-suite-v22.part06?release=22',
  './data/mobile-suite/mobile-suite-v22.part07?release=22',
  './manifest.webmanifest?brand=25',
  './manifest-v2.webmanifest?brand=25',
  './icons/kagenexus-favicon-v19.svg?brand=25',
  './data/app/anime-haven-v4.part00?package=4',
  './data/app/anime-haven-v4.part01?package=4',
  './data/app/anime-haven-v4.part02?package=4'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const results = await Promise.allSettled(CORE.map(url => cache.add(url)));
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn('KageNexus cache skipped', CORE[index], result.reason);
      }
    });
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

const remember = (event, cache, request, response) => {
  if (!response?.ok) return response;
  event.waitUntil(
    cache.put(request, response.clone())
      .catch(error => console.warn('KageNexus cache write skipped', error))
  );
  return response;
};

const networkFirst = async (event, request, cache) => {
  try {
    const response = await fetch(request);
    if (!response?.ok) throw new Error(`Navigation returned ${response?.status || 0}`);
    return remember(event, cache, request, response);
  } catch (error) {
    return await cache.match(request) ||
      await cache.match('./index.html') ||
      await cache.match('./offline.html') ||
      Promise.reject(error);
  }
};

const cacheFirst = async (event, request, cache) => {
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  return remember(event, cache, request, response);
};

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (request.mode === 'navigate') return networkFirst(event, request, cache);
    return cacheFirst(event, request, cache);
  })());
});
