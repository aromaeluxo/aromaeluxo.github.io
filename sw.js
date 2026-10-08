// Troque a versão sempre que publicar mudanças no admin.html
const V = 'marilia-adm-v23';
const SHELL = ['admin.html', 'manifest.json', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // Firebase/CDN passam direto
  // rede primeiro: sempre pega a versão nova quando há internet; cache quando offline
  // cache:'no-store' ignora o cache HTTP do GitHub (10 min) e garante a versão publicada
  e.respondWith(fetch(e.request.url, { cache: 'no-store', credentials: 'same-origin' }).then(r => { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
