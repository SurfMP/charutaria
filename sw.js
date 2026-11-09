// Ao publicar uma correção, aumente a VERSAO: o celular baixa a nova versão e oferece "Atualizar".
const VERSAO = "charutaria-v1.0.0";
const ARQUIVOS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("message", e => { if (e.data === "atualizar") self.skipWaiting(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(resp => {
      if (resp.ok && new URL(e.request.url).origin === location.origin) {
        const copia = resp.clone(); caches.open(VERSAO).then(c => c.put(e.request, copia));
      }
      return resp;
    }).catch(() => caches.match("./index.html")))
  );
});
