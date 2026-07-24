const CACHE = 'kagenexus-v32-navigation-handoff';
const CORE = [
  './',
  './index.html',
  './offline.html',
  './bootstrap-v4.js?release=32',
  './kagenexus-brand-v19.js?release=19',
  './rubber-search-v11.js?release=11',
  './rubber-search-v11.css?release=11',
  './rubber-search-compact-v12.js?release=12',
  './rubber-search-compact-v12.css?release=12',
  './nav-scroll-guard-v13.js?release=14',
  './library-manager-v15.js?release=15',
  './library-manager-v14.css?release=15',
  './mobile-suite-loader-v22.js?release=28',
  './assets/css/power-transform-v29.css?release=32',
  './assets/js/power-transform-v29.js?release=32',
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
    const results = await Promise.allSettled(
      CORE.map(url => cache.add(url))
    );
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(
          'KageNexus cache skipped',
          CORE[index],
          result.reason
        );
      }
    });
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key !== CACHE)
        .map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response?.ok) {
        const cacheCopy = response.clone();
        caches.open(CACHE)
          .then(cache => cache.put(request, cacheCopy))
          .catch(error => {
            console.warn('KageNexus cache write skipped', error);
          });
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return await caches.match('./index.html') ||
          await caches.match('./offline.html');
      }
      throw error;
    }
  })());
});
