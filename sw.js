/* Service worker — Jornada
   La page vient du réseau quand il est là, du cache sinon.
   Les icônes et les polices distantes sont servies depuis le cache.
   Après chaque modification de l'appli, incrémente VERSION. */

const VERSION = "v1";
const CACHE = "jornada-" + VERSION;

const FICHIERS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png"
];

const POLICES = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(FICHIERS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e=>{
  const req = e.request;
  if(req.method !== "GET") return;

  // Navigation : réseau d'abord, cache en secours
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req)
        .then(rep=>{
          const copie = rep.clone();
          caches.open(CACHE).then(c => c.put("./index.html", copie));
          return rep;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  const hote = (()=>{ try{ return new URL(req.url).hostname; }catch(e){ return ""; } })();
  const cacheable = req.url.startsWith(self.location.origin) || POLICES.includes(hote);

  e.respondWith(
    caches.match(req).then(rep => rep || fetch(req).then(r=>{
      if(r && cacheable && (r.status === 200 || r.type === "opaque")){
        const copie = r.clone();
        caches.open(CACHE).then(c => c.put(req, copie));
      }
      return r;
    }).catch(()=> rep))
  );
});
