// 小役カウンター: 画面は常にネットワークから取得。カウントは端末のlocalStorageに保存。
const VERSION='1.1.321';
self.addEventListener('install',event=>{self.skipWaiting()});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/sw.js')){
    event.respondWith(fetch(new Request(req,{cache:'no-store'})).catch(()=>caches.match(req)));
  }
});
