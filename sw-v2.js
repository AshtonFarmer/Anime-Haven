const CACHE='anime-haven-v13';
const CORE=[
  './',
  './index.html',
  './bootstrap-v4.js?release=10',
  './assets/haki-idle-0.js?release=13',
  './assets/haki-idle-1.js?release=13',
  './assets/haki-idle-rest.js?release=13',
  './assets/haki-final-0.js?release=13',
  './assets/haki-final-1.js?release=13',
  './rubber-search-v13.js?release=13',
  './rubber-search-v13.css?release=13',
  './manifest-v2.webmanifest',
  './icons/icon.svg',
  './anime-haven-v4.part00?package=4',
  './anime-haven-v4.part01?package=4',
  './anime-haven-v4.part02?package=4'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))));
});
