const CACHE='anime-haven-v6';
const CORE=[
  './',
  './index.html',
  './bootstrap-v3.js?v=6',
  './manifest-v2.webmanifest',
  './icons/icon.svg',
  './anime-haven-v4.part00?v=4',
  './anime-haven-v4.part01?v=4',
  './anime-haven-v4.part02?v=4'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(
    caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      return response;
    }).catch(()=>caches.match('./index.html')))
  );
});
