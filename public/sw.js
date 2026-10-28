/* Service worker de EcoGuide Formosa.
   El mapa, las fichas y los audios se guardan para que la app sirva en el
   lugar, sin datos. */

const VERSION = "ecoguide-v2";
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

/* Contenido publicado: se guarda despues de activar, para que la instalacion
   no dependa de la base y el usuario pueda abrir cualquier ficha sin senal. */
async function precacheContent() {
  const response = await fetch("/api/precache", { cache: "no-store" }).catch(
    () => null,
  );
  if (!response || !response.ok) return;
  const data = await response.json().catch(() => null);
  const urls = Array.isArray(data?.urls) ? data.urls : [];
  const cache = await caches.open(SHELL_CACHE);
  await Promise.allSettled(
    urls.map(async (url) => {
      if (typeof url !== "string" || !url.startsWith("/")) return;
      const cached = await cache.match(url, { ignoreVary: true });
      if (!cached) await cache.add(url);
    }),
  );
}

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "precache") {
    event.waitUntil(precacheContent());
  }
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

/* Paginas con sesion: no se guardan, para no servirle a otra persona del
   dispositivo una vista con datos de la anterior. */
const PRIVATE_PREFIXES = [
  "/admin",
  "/mis-rutas",
  "/mis-capsulas",
  "/ingresar",
  "/registrarse",
];

function isPrivate(url) {
  return PRIVATE_PREFIXES.some(
    (prefix) => url.pathname === prefix || url.pathname.startsWith(prefix + "/"),
  );
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

  // Navegacion: red primero; lo que se visita queda guardado para el lugar
  // sin senal, y si no hay copia se cae en la pagina de sin conexion.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && !isPrivate(url)) {
            const headers = new Headers(response.headers);
            // Sin Vary: la copia tiene que servir a la proxima navegacion
            // aunque cambien las cabeceras de Next (RSC, estado del router).
            headers.delete("Vary");
            const copy = new Response(response.clone().body, {
              status: response.status,
              statusText: response.statusText,
              headers,
            });
            caches
              .open(SHELL_CACHE)
              .then((cache) => cache.put(request, copy))
              .catch(() => {});
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request, { ignoreVary: true });
          return (
            cached ||
            (await caches.match("/offline")) ||
            Response.redirect("/offline")
          );
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
