/* Service worker de EcoGuide Formosa.
   El mapa, las fichas y los audios se guardan para que la app sirva en el
   lugar, sin datos. */

const VERSION = "ecoguide-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const TILES_CACHE = `${VERSION}-tiles`;
const MEDIA_CACHE = `${VERSION}-media`;
const DATA_CACHE = `${VERSION}-data`;

const SHELL_ASSETS = [
  "/",
  "/mapa",
  "/rutas",
  "/guias",
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/brand/sello.png",
  "/textures/paper.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // Un recurso que falla no puede vaciar el precache entero.
      .then((cache) =>
        Promise.allSettled(SHELL_ASSETS.map((asset) => cache.add(asset))),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isTile(url) {
  return /tile\.openstreetmap\.org/.test(url.hostname);
}

function isMedia(url) {
  return url.pathname.startsWith("/media/");
}

function isData(url) {
  return url.pathname.startsWith("/api/");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Tiles del mapa: primero la red, despues la cache (stale-while-revalidate).
  // Son de otro origen, asi que se atienden antes del filtro de origen propio.
  if (isTile(url)) {
    event.respondWith(
      caches.open(TILES_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Audio y video: cache primero, son pesados y no cambian
  if (isMedia(url)) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      }),
    );
    return;
  }

  // Datos: red primero, cache como respaldo
  if (isData(url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return (
            cached ||
            new Response(
              JSON.stringify({ error: "Sin conexión y sin copia local" }),
              { status: 503, headers: { "Content-Type": "application/json" } },
            )
          );
        }),
    );
    return;
  }

  // Navegacion: red primero, y la app shell como respaldo.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(request);
        return cached || (await caches.match("/offline")) || Response.redirect("/offline");
      }),
    );
    return;
  }

  // Recursos estaticos: cache primero. Las paginas NO entran aqui: precachear
  // "/" guardaria una copia sin sesion que se sirve por error a cualquier fetch.
  const STATIC_PREFIXES = [
    "/_next/static/",
    "/icons/",
    "/media/",
    "/brand/",
    "/textures/",
    "/fonts/",
  ];
  if (STATIC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
  }
});
