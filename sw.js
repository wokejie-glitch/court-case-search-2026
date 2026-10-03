/* 中国法院2026年度案例速查 离线缓存 case-V4.6-202610031035 */
const V = "case-V4.6-202610031035";
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c =>
    Promise.allSettled(['./', './index.html', './manifest.webmanifest', './icons/icon.png'].map(u => c.add(u)))
  ).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.origin !== location.origin) return;
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => {
    const refresh = fetch(req).then(res => {
      if (res && res.ok) { const cl = res.clone(); caches.open(V).then(c => c.put(req, cl)); }
      return res;
    }).catch(() => hit);
    return hit || refresh;
  }));
});
