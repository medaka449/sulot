// PWA v1.1.528: app shell offline, fresh HTML online, image caching.
const CACHE='koyaku-pwa-v1.1.528';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.allSettled(SHELL.map(async path=>{const response=await fetch(path,{cache:'reload'});if(response.ok)await cache.put(path,response);}));await self.skipWaiting();})());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith('koyaku-')&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin||!url.pathname.startsWith('/sulot/'))return;
 if(req.mode==='navigate'||url.pathname.endsWith('/index.html')){
  event.respondWith(fetch(new Request(req,{cache:'no-store'})).then(res=>{
   if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));}
   return res;
  }).catch(async()=>await caches.match('./index.html')||Response.error()));
  return;
 }
 event.respondWith(caches.match(req).then(cached=>{
  if(cached)return cached;
  return fetch(req).then(res=>{
   if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
   return res;
  });
 }));
});
