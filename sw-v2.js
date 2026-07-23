const CACHE='kagenexus-v22-mobile-suite';
const CORE=[
  './','./index.html','./offline.html',
  './bootstrap-v4.js?release=18','./kagenexus-brand-v19.js?release=19',
  './rubber-search-v11.js?release=11','./rubber-search-v11.css?release=11',
  './rubber-search-compact-v12.js?release=12','./rubber-search-compact-v12.css?release=12',
  './nav-scroll-guard-v13.js?release=14','./library-manager-v15.js?release=15','./library-manager-v14.css?release=15',
  './power-transform-v21.js?release=21','./power-transform-motion-v20.js?release=20','./power-transform-v20.css?release=20','./power-touch-v21.css?release=21',
  './mobile-suite-loader-v22.js?release=22',
  './mobile-suite-v22.part00?release=22','./mobile-suite-v22.part01?release=22','./mobile-suite-v22.part02?release=22','./mobile-suite-v22.part03?release=22',
  './mobile-suite-v22.part04?release=22','./mobile-suite-v22.part05?release=22','./mobile-suite-v22.part06?release=22','./mobile-suite-v22.part07?release=22',
  './manifest.webmanifest?brand=19','./manifest-v2.webmanifest?brand=19',
  './icons/kagenexus-favicon-v19.svg','./icons/kagenexus-icon.png?brand=19',
  './anime-haven-v4.part00?package=4','./anime-haven-v4.part01?package=4','./anime-haven-v4.part02?package=4'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(CORE.map(url=>cache.add(url)))).then(results=>{
    results.forEach((result,index)=>{if(result.status==='rejected')console.warn('KageNexus cache skipped',CORE[index],result.reason)});
  }));
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const request=event.request;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));
      return response;
    }).catch(async()=>await caches.match(request)||await caches.match('./index.html')||await caches.match('./offline.html')));
    return;
  }
  event.respondWith(fetch(request).then(response=>{
    if(response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));
    return response;
  }).catch(()=>caches.match(request)));
});
