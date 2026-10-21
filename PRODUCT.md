# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router) full-stack + PWA instalable. Elegido por el usuario entre las opciones
presentadas: una sola base de código para web, tablet y móvil instalable, con cámara y GPS nativos
del navegador.

- Frontend: Next.js 16 + React 19 + TypeScript, Tailwind CSS v4
- Datos: Prisma 7 sobre Neon Postgres — proyecto `ecoguide-formosa` (`icy-poetry-20547442`),
  región `aws-us-east-2`, base `ecoguide`, rol `ecoguide_owner`
- Auth: Auth.js / NextAuth v5, credenciales + Prisma Adapter, sesión JWT
- Cartografía: Leaflet + react-leaflet (t ráster cacheados por el service worker)
- QR: `jsQR` sobre `getUserMedia`, con entrada manual como respaldo
- Estado cliente: Zustand; validación: Zod; avisos: Sonner

## Users

- **Turista visitante**, en el lugar o planificando el viaje: quiere saber qué hay cerca, entender
  qué está viendo y listener la historia del sitio sin gastar datos ni cobertura.
- **Guía local y promotor turístico** de Formosa: quiere contar su territorio con su propia voz,
  dejar su material disponible para quien llega y construir su reputación.
- **Estudiante de tecnicatura o instituto superior** de Formosa y zonas de influencia (El Colorado):
  se forma en oratoria, locución y marketing digital mientras aporta contenido.
- **Emprendedor del sector ecoturístico** y desarrollador o entusiasta técnico local.

## Product Purpose

Dar a la provincia de Formosa una herramienta accesible (web + app móvil instalable) con
geolocalización, códigos QR, fichas interactivas, audioguías y videos cortos. El fin es potencian
al mismo tiempo las habilidades de oratoria y marketing digital de quienes cargan el contenido, no
solo publicar un catálogo de lugares.

Criterio de éxito: un punto de interés de Formosa con ficha, audioguía en español, guaraní e inglés,
y clip vertical associated, alcanzable desde el mapa sin cobertura y activable desde la señalética
física por QR.

## Positioning

El diferencial no es el mapa: es la voz local registrada y verificada, atada a un punto geográfico
exacto, disponible sin señal y disparable por la señalética física del lugar. Un mapa con POIs
muestra dónde; EcoGuide muestra qué se está mirando, quién lo sabe y cómo se cuenta.

## Operating Context

- El usuario real está **de pie, al sol, sin señal**, con el teléfono en una mano y auriculares. De
  ahí el modo offline como requisito de primera clase, no como extra.
- El guía captura su material de la misma forma: en el lugar, con la voz en la garganta, subiendo
  audio desde el teléfono.
- El contenido es **el activo**: audioguías grabadas por personas, clips verticales para redes,
  textos de ficha. La plataforma es el vehicle, el contenido es lo que la distingue.
- Los talleres de oratoria y redes del programa son la fuente de ese contenido. La plataforma
  publica el resultado (cápsulas aprobadas); la gestión de los talleres vive fuera del producto.
- Los puntos geográficos son reales y verificables: coordinates GPS, altura, región, categoría.

## Capabilities and Constraints

Módulos del PDF de bases y condiciones:

1. **Geolocalización y mapa interactivo** — mapa vectorial con coordenadas GPS, puntos cercanos en
   tiempo real dentro de la provincia.
2. **Escáner QR integrado** — lectura de la señalética física, activando ficha y audioguía al
   escanear. Respaldo de entrada manual para dispositivos sin cámara.
3. **Multimedia** — reproductor de audio (audioguías en segundo plano) y visor de micro-videos en
   formato vertical (Reels).
4. **Capacitación y perfil de comunidad** — guías y creadores locales cargan sus propias cápsulas,
   con moderación técnica previa.

Panel de administración (todo confirmado por el usuario): gestión de puntos de interés y rutas,
moderación de la comunidad, gestión de usuarios y guías, y analíticas de visitas.

Idiomas: español, guaraní e inglés. El idioma aplica a la interfaz (español) y al contenido de
audio (campo de idioma por audioguía con selector en el reproductor).

Sin cobros: la plataforma es gratuita. No hay pasarela de pago, suscripciones ni entradas.

Sin gestión de talleres dentro del producto: no hay inscripción, entregas ni evaluación del
programa de capacitación.

Restricciones técnicas: el proyecto corre en local primero; la base es Neon Postgres en la nube;
las texturas de mapa deben poder cachearse para el uso sin conexión.

## Brand Commitments

- Nombre: **EcoGuide Formosa**. Descriptor: **Turismo Regional & Naturaleza**.
- El logo es un emblema circular de sello de reserva natural: ilustración naturalista de yacaré,
  garza, palmeras, río y brújula, sobre fondo arena, con tinta verde petróleo y acentos terracota y
  turquesa. Es la referencia visual vinculante: archivo maestro en `public/brand/logo-original.jpg`.
- Voz en español rioplatense, cercano y directo. La interfaz se dirige al usuario local con
  familiaridad ("sos", "vos") sin informalidad caricaturesca.
- Registro del programa:/eplural "Turismo Regional & Naturaleza" y "EcoGuide Formosa" en mayúsculas
  sostenidas en el sello. Conservar esa construcción al escribir.

## Evidence on Hand

- Logo maestro: `public/brand/logo-original.jpg` (1024×1024, JPEG, 256 KB).
- PDF de bases y condiciones, arquitectura y plan de trabajo: el documento del programa (fuente de
  la estructura de módulos y de las fases).
- Datos reales de Formosa: los puntos de interés del seed son contenido de trabajo con datos
  reales de la provincia (nombre, categoría, región, coordenadas). Marcados como contenido inicial
  a revisar por el equipo, no como censo oficial.

Ausencias que el trabajo futuro no debe fabricar: reseñas de usuarios reales, calificaciones de
guías reales, cifras de visitas reales, testimonios, premios, cobertura de prensa, y todo dato
presentado como nómina o usuario existente que no sea de demostración claramente etiquetado.

## Product Principles

1. **El contenido local es el producto.** La infraestructura sirve a la voz y al territorio; si una
   función no mejora la carga, la lectura o el descubrimiento de contenido local, sobra.
2. **Sin señal es el caso normal, no la excepción.** Todo lo que un visitante necesita en el
   lugar debe estar disponible sin conexión.
3. **Geolocalización antes que catálogo.** El valor aparece por ubicación y por señalética física,
   no por navegación por categorías.
4. **La voz tiene autoría.** Cada audioguía y cada clip pertenece a una persona identificable que
   puede ser contactada.
5. **Cero contenido inventado.** No reseñas, métricas ni testimonios fabricados; lo que no existe,
   no se muestra.

## Accessibility & Inclusion

- Estándar objetivo: WCAG 2.2 AA. Contraste de texto ≥ 4.5:1, foco visible en todo control
  interactivo, navegación completa por teclado.
- El uso real es en exterior, a plein air, con una mano ocupada y pantalla a contraluz: objetivos
  táctiles de 44 px mínimo, contraste alto, y controles grandes.
- `prefers-reduced-motion` respetado: se reduce el movimiento, no la comprensión.
- Interfaz en español; el contenido de audio disponible en español, guaraní e inglés cubre la
  diversidad de visitantes de la provincia.
