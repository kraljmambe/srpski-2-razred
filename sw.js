// Рад без интернета: апликација се сачува при првом отварању.
// Прво мрежа (свеже), а кад нема мреже – сачувана копија. При измени питања повећај број верзије.
const KES = "srpski2-v2";
const LJUSKA = ["./", "index.html", "pitanja.js", "manifest.json", "ikona-192.png", "ikona-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(KES).then(c => c.addAll(LJUSKA)).catch(() => {})); });
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== KES).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const svoj = e.request.url.startsWith(self.location.origin);
  const font = /fonts\.(googleapis|gstatic)\.com/.test(e.request.url);
  if (!svoj && !font) return;
  e.respondWith(
    fetch(e.request).then(odg => {
      if (odg.ok || odg.type === "opaque") { const k = odg.clone(); caches.open(KES).then(c => c.put(e.request, k)); }
      return odg;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
