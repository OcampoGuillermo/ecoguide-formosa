# EcoGuide Formosa

> Plataforma de ecoturismo digital para la provincia de Formosa, Argentina. Mapa con
> geolocalización, audioguías de guías locales en tres idiomas, escáner QR de la
> señalética, rutas temáticas y una comunidad de guías con moderación.

Web app instalable (PWA): la misma base de código sirve en escritorio, tablet y
teléfono, y funciona sin cobertura en el lugar.

---

## Los cuatro módulos del programa

| Módulo | Qué hace |
| --- | --- |
| **Geolocalización y mapa** | Mapa vectorial con los 12 puntos de interés reales de la provincia, coordenadas GPS, filtros por categoría y departamento, y geolocalización del visitante. |
| **Escáner QR** | Lectura de la señalética física con la cámara del teléfono; abre la ficha, la audioguía y el clip del lugar. Respaldo de entrada manual para equipos sin cámara. |
| **Multimedia** | Reproductor de audioguías en español, guaraní e inglés (con caché offline y control de velocidad), y visor de microvideos verticales. |
| **Capacitación y comunidad** | Perfiles de guías verificados, con especialidades e idiomas, que cargan sus propias cápsulas; cada envío pasa por moderación técnica antes de publicarse. |

Además, un **panel de administración** con gestión de puntos y rutas, moderación de la
comunidad, gestión de usuarios y guías, y analíticas de visitas.

---

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, RSC) + React 19 + TypeScript 5 |
| Estilos | Tailwind CSS v4 con tokens en `@theme` |
| Datos | Prisma 7 sobre Neon Postgres (driver adapter `@prisma/adapter-neon`) |
| Auth | Auth.js / NextAuth v5, credenciales + Prisma Adapter, sesión JWT |
| Cartografía | Leaflet + react-leaflet |
| QR | `jsQR` sobre `getUserMedia` |
| Estado | Zustand · validación Zod · avisos Sonner |
| Fuentes | Archivo Variable y Azeret Mono Variable, self-hosted |

---

## Arranque local

```bash
npm install
cp .env.example .env      # completar DATABASE_URL y AUTH_SECRET
npx prisma db push        # crea el esquema en Postgres
npm run db:seed           # carga puntos, rutas, guías y el contenido
npm run dev
```

La app queda en `http://localhost:3000` (o el siguiente puerto libre).

### Variables de entorno

```env
DATABASE_URL="postgresql://usuario:clave@host/neon?sslmode=require"
AUTH_SECRET="secreto-de-32-bytes"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Cuentas del seed

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administración | `admin@ecoguide.formosa` | `ecoguide-admin-2026` |
| Guías | `mariela@ecoguide.formosa` (y 4 más) | `ecoguide-guia-2026` |

> El seed es material de trabajo: las pistas de audio son TTS de demostración
> (`voice: "tts"`, con la marca visible en el reproductor), los perfiles de guía
> vienen marcados como `isDemo` (con un sello "Demostración" en `/guias`) y tienen que
> reemplazarse por personas y grabaciones reales antes de publicar.

---

## Base de datos

Proyecto Neon **`ecoguide-formosa`** (`icy-poetry-20547442`), región `aws-us-east-2`,
base `ecoguide`, rol `ecoguide_owner`.

Modelos: `User`, `GuideProfile`, `PointOfInterest`, `AudioGuide`, `VideoContent`,
`Route`, `RoutePoint`, `ContentSubmission` (moderación), `Review`, `Favorite`, `Visit`,
`RouteVisit`, `AnalyticsEvent`, más las tablas de Auth.js.

```bash
npm run db:push        # sincroniza el esquema
npm run db:seed        # siembra (idempotente)
npm run db:studio      # abre Prisma Studio
```

---

## Sistema de diseño

El mundo visual es un **cartel de propaganda turística argentino de 1956–1972**:
litografía offset a cuatro tintas sobre papel de póster amarillento. La paleta no se
inventó: se extrajo del logo maestro del proyecto (`scripts/logo-palette2.py`).

- Papel arena `#EADEC0` con grano de offset
- Tinta petróleo `#0F3246` (texto, filetes, bloques de tinta)
- Terracota `#A8501C` (único acento de acción)
- Turquesa río `#3FB5B8`, oliva Chaco `#5A6B3C`, naranja atardecer `#F8A652`
- Archivo variable condensada (`wdth` 68) para titulares, ancho normal para interfaz
- Azeret Mono para toda medida, con cifras tabulares
- Sin sombras: la estructura la llevan filetes de 1 y 2 px

Tokens y reglas completos en [`DESIGN.md`](DESIGN.md) y `.impeccable/design.json`.

---

## Recursos locales

Todo el contenido del seed se genera con herramientas locales, sin descargas de
terceros:

```bash
python scripts/texture-paper.py    # grano de papel y trama de medio tono
python scripts/badge-mask.py       # sello circular con alfa
python scripts/gen-video.py        # 12 clips verticales (poster + tirada de tinta)
python scripts/make-posters.py      # póster JPEG de cada clip
powershell -File scripts/gen-audio.ps1   # 36 audioguías con las voces de Windows
```

---

## Verificación

```bash
npm run typecheck      # tsc --noEmit
npm run lint
npm run build
python scripts/check-routes.py   # recorre todas las rutas y reporta estados
node scripts/cdp-shot.mjs <url> <salida.png> 390 844   # captura con viewport real
node scripts/cdp-offline.mjs                     # prueba la app sin conexión
node scripts/cdp-map-diag.mjs <url>              # mide el mapa (tiles, contenedor)
```

`scripts/cdp-shot.mjs` usa CDP para emular cualquier viewport (el modo `--window-size`
de Chrome headless no baja de 504 px) y falla con código 2 si hay desborde horizontal.
Acepta `--login=correo:clave` para capturar páginas que requieren sesión.

`scripts/cdp-offline.mjs` verifica la promesa central del producto: carga la portada,
corta la red con `Network.emulateNetworkConditions`, recarga y comprueba que la página
sigue renderizando desde el service worker.

`scripts/cdp-map-diag.mjs` informa el tamaño del contenedor de Leaflet y la grilla de
tiles: es la forma rápida de detectar un mapa descuadrado.

### Nota sobre Leaflet

El mapa se arma con Leaflet directo (`src/components/map/map-canvas.tsx`) y **necesita
`leaflet/dist/leaflet.css` importado en el layout**: sin esa hoja los tiles caen en el
flujo normal de la página y quedan escalonados en vez de cubrir el contenedor.

---

## PWA

`public/manifest.webmanifest` + `public/sw.js`:

- El shell, el mapa y los medios se cachean para servir sin señal.
- Los tiles de OpenStreetMap usan *stale-while-revalidate*.
- Las APIs usan *network-first* con respaldo en caché.
- La navegación cae en `/offline` cuando no hay red.
- El registro del service worker vive en `src/components/service-worker-registration.tsx`.

---

## Licencia

MIT.
