# Despliegue de EcoGuide Formosa

La app es **Next.js 16 (App Router) + Node 22 + Prisma 7 + Neon Postgres**, con
service worker propio (PWA instalable). Cualquier hosting que corra Node 22 con
un dominio HTTPS sirve la app sin cambios de código.

---

## 1. Qué necesita la app para funcionar

| Pieza | Dónde | Nota |
| --- | --- | --- |
| Node 22 | Runtime del host | El build usa `npm run build` (que corre `prisma generate` + `next build`). |
| `DATABASE_URL` | Neon Postgres | Ya está creado y sembrado. Necesita ser una URL con `sslmode=require`. |
| `AUTH_SECRET` | Variable de entorno | 32 bytes aleatorios: `openssl rand -base64 32`. |
| `AUTH_TRUST_HOST` | Variable de entorno | `true` en Vercel y la mayoría de los PaaS. |
| `NEXTAUTH_URL` | Variable de entorno | La URL pública final (con `https://`). |
| `NEXT_PUBLIC_APP_URL` | Variable de entorno | La URL pública final. |
| `public/media/**` | Build | 13,4 MB de audio y video que viajan con el despliegue. |

La base **no necesita `db push` ni seed al desplegar**: ya está migrada y
sembrada. Solo si querés empezar de cero en otra base:

```bash
npx prisma db push && npm run db:seed
```

---

## 2. Comparación de los planes gratuitos (octubre 2026)

| Hosting | Gratis de verdad | Límites que importan | Para esta app |
| --- | --- | --- | --- |
| **Vercel Hobby** | Sí, sin tarjeta | 100 GB de transferencia, 1 M de requests CDN, 1 M de invocaciones, **4 horas de CPU activa**, 100 MB de subida estática, 1 build a la vez, 45 min de build | **El más simple.** Los límites de CPU son el muro: ~150–280 mil páginas SSR al mes |
| **Render Free** | Sí, sin tarjeta | 512 MB / 0,1 vCPU, **se duerme a los 15 min** (despierta en ~1 min), 750 h de instancia al mes, **5 GB de ancho de banda** (bajó de 100 GB en abril 2026), 500 min de build | Servidor real, pero el despertar de 1 min rompe la demo y los 5 GB se acaban con el audio y los clips |
| **Railway Free** | Casi: $1 de crédito al mes tras un trial de $5 | 1 proyecto, 3 servicios, 0,5 GB de RAM, **0 dominios propios** | Es un trial, no un plan. El subdominio aleatorio de Railway sirve para probar |
| **Fly.io** | No | El free tier terminó en octubre 2024. Trial de 2 h de máquina o 7 días. La máquina más chica cuesta ~$1,94/mes | Descartado como gratis |
| **Koyeb** | No sin tarjeta | Desde febrero 2026 exige tarjeta con *$29 de depósito*. El free instance existe dentro de Pro (512 MB, escala a cero a la hora) | Solo si ya tenés tarjeta |
| **Cloudflare Workers** | Sí, sin tarjeta | **100.000 requests/día y 10 ms de CPU por request** (límite duro), sin cargo por egress, worker de 3 MiB en free | Los 10 ms matan el SSR con Prisma. Además exige migrar la app a `vinext` u OpenNext: no es el mismo proyecto |
| **Google Cloud Run** | Sí (con tarjeta) | 2 M de requests/mes, 180.000 vCPU-s, escala a cero; lo que pases se cobra | Correcto y con margen; pide tarjeta y un Dockerfile (ya está en el repo) |
| **Oracle Cloud Always Free** | Sí (con tarjeta) | 2 OCPUs ARM + 12 GB (bajó de 24 GB en junio 2026), 10 TB de egress, instances ociosas se pueden reciclar a los 7 días | **El único "gratis para siempre" sincliff de cuota.** Pide tarjeta y un rato de sysadmin |
| **Netlify** | Sí, sin tarjeta | 300 créditos al mes (desde septiembre 2025) | Alternativa viable, menos específica para Next.js |

**Neon (la base que ya usás)**: plan gratuito con 100 CU-horas al mes por proyecto y
0,5 GB de almacenamiento. Alcanza de sobra para esta app.

---

## 3. Recomendación

### Primera opción: **Vercel Hobby**

Cero fricción: conectás el repo, importás las variables, y en dos minutos está
publicada con HTTPS y previews por pull request. Los límites son generosos para
un lanzamiento de programa (100 GB de transferencia; nuestro contenido pesado son
13,4 MB, así que da para decenas de miles de sesiones completas).

**La única condición que hay que leer con atención:** el plan Hobby es
**solo para uso personal y no comercial**. La definición de Vercel es amplia:
cualquier despliegue que sirva para obtener ganancia económica para alguien
involucrado en el proyecto. Pedir donaciones está explícitamente permitido.
Un programa público de innovación turística sin cobro debería entrar, pero es una
decisión del programa, no mía: si en algún momento el proyecto monetiza algo,
hace falta el plan **Pro de 20 USD/mes**.

Los dos límites que vigila:
- **4 horas de CPU activa al mes**: con ~50–100 ms por página renderizada, eso
  da del orden de 150 mil a 280 mil páginas. Alcanza para un lanzamiento; si el
  tráfico crece, ahí se corta (Vercel **pausa** el servicio, no cobra de más).
- **1 build a la vez**: cada push encolará un build. No es problema para este
  ritmo de trabajo.

### Segunda opción: **Render Free** (si la cláusula comercial molesta)

Sin tarjeta y con un servidor real, pero con dos surgically cambios de UX:
el servicio se duerme a los 15 minutos y tarda ~1 minuto en despertar, y el
ancho de banda bajó a 5 GB al mes. Con nuestro contenido multimedia, 5 GB se van
en unas 2.500 sesiones. Para una demostración interna sirve; para mostrarlo en
el campo, no.

### Tercera opción: **Oracle Cloud Always Free** o **Google Cloud Run** (máximo margen)

Un servidor de verdad, siempre encendido, sin techo de cuota. Requiere tarjeta
(Oracle pide también teléfono) y un rato de configuración: el `Dockerfile` ya está
en el repo, así que es construir la imagen, levantarla con el proxy y el
certificado. Es la opción con menos sorpresas a mediano plazo.

---

## 4. Pasos para Vercel (recomendado)

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # produccion
```

O desde el panel: **New Project → importar el repo →** en *Environment Variables*:

```
DATABASE_URL     = (la de Neon, con la clave nueva)
AUTH_SECRET      = (openssl rand -base64 32)
AUTH_TRUST_HOST  = true
NEXTAUTH_URL     = https://<tu-dominio>
NEXT_PUBLIC_APP_URL = https://<tu-dominio>
```

- **Build command**: `npm run build` (por defecto).
- **Install command**: `npm install` (por defecto; el `postinstall` corre `prisma generate`).
- **Output**: `.next` (por defecto con Next.js).
- Después: `vercel env pull` para bajar las variables y `npm run db:seed` si
  querés recargar el contenido.

### Notas de Auth.js en Vercel
`AUTH_TRUST_HOST=true` es obligatorio: sin él, el callback de login rebota.

### Notas de la PWA
- El service worker (`public/sw.js`) se sirve como archivo estático: no necesita
  configuración especial, pero sí HTTPS.
- En el primer deploy, la web se instala sola. Los usuarios la agregan desde el
  navegador ("Añadir a la pantalla de inicio").
- La cámara del escáner QR necesita **HTTPS** o `localhost`. En un dominio de
  Vercel ya tenés HTTPS ✓.

---

## 5. Con Docker (Render, Cloud Run, Fly, Railway, cualquier VPS)

```bash
docker build -t ecoguide .
docker run -p 3000:3000 --env-file .env ecoguide
```

El `Dockerfile` ya está en el repo: build multi-etapa con Node 22, usuario sin
privilegios y la app servida con `next start`.

En Render: **New → Web Service → Docker**, puerto `3000`.
En Cloud Run: `gcloud run deploy --source . --set-env-vars-file .env --port 3000`.

---

## 6. Lo que conviene revisar antes de un lanzamiento real

1. **El audio es TTS de demostración.** Hay que reemplazarlo por las
   grabaciones de los guías; la interfaz ya lo marca.
2. **Los perfiles de guía del seed son de demostración** (`isDemo`), con sello
   visible. No hay que publicarlos como reales.
3. **Las distancias de las rutas** son del seed y hay que ajustarlas al terreno.
4. **El panel es real** pero la verificación de guías es manual: decidan quién
   verifica a quién antes de abrirlo al público.
5. **Sin reseñas ni calificaciones inventadas**: la app arranca con estados
   vacíos honestos.
6. **Migración de base**: el proyecto Neon actual tiene una sola rama
   (`production`). Antes de abrir al público, conviene una rama de desarrollo
   separada (`neon branches create`) para que los experimentos no toquen la de
   publicación.
