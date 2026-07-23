const CACHE='kagenexus-v17';
const CORE=[
  './',
  './index.html',
  './bootstrap-v4.js?release=17',
  './kagenexus-brand-v17.js?release=17',
  './rubber-search-v11.js?release=11',
  './rubber-search-v11.css?release=11',
  './rubber-search-compact-v12.js?release=12',
  './rubber-search-compact-v12.css?release=12',
  './nav-scroll-guard-v13.js?release=14',
  './library-manager-v15.js?release=15',
  './library-manager-v14.css?release=15',
  './manifest-v2.webmanifest',
  './manifest.webmanifest',
  './icons/kagenexus-icon.png',
  './icons/icon.svg',
  './anime-haven-v4.part00?package=4',
  './anime-haven-v4.part01?package=4',
  './anime-haven-v4.part02?package=4'
];
self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE).then(cache=>Promise.all(CORE.map(url=>cache.add(url).catch(error=>console.warn('KageNexus cache skipped',url,error))))).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))));
});
