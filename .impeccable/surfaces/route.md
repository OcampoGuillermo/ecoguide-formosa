---
version: 1
slug: "route"
primary_target: "route:/"
related_targets: []
---

# Superficie: EcoGuide Formosa — landing y aplicación

## Alcance y modo del visitante

Producto completo (web + PWA instalable) para turismo regional y naturaleza de la
provincia de Formosa. La landing es **Persuade**: el visitante decide si entra al mapa,
si instala la app o si se suma como guía. Las pantallas de la aplicación (mapa, punto,
ruta, guías, escáner, panel) son **Operate**: el visitante completa una tarea en el
lugar, con el teléfono en una mano y frecuentemente sin señal.

## Audiencia, trabajo, acción y prueba

- **Visitante en destino**: quiere saber qué tiene delante y escucharlo sin gastar datos.
  Acción: abrir el mapa, localizar un punto, reproducir su audioguía.
- **Guía local**: quiere publicar su voz y su material. Acción: crear una cápsula,
  enviarla a moderación, ver su estado.
- **Prueba disponible**: mapa en vivo con puntos reales de Formosa, audioguías reales
  en tres idiomas, rutas con distancia y desnivel, y el escáner QR de la señalética.

## Dirección elegida y momento memorable

Mundo: **cartel de propaganda turística argentino (1956–1972)** — litografía offset a
cuatro tintas sobre papel de póster amarillento, con desregistro entre planchas.

Momento memorable: **la tirada de la hoja**. Al entrar, la lámina del titular se
imprime — un barrido de tinta que deja ver el desregistro — y el mapa en vivo aparece
como la prueba de que la plataforma existe de verdad, no como un catálogo.

## Decisiones sin resolver

- El logo del sello ya existe (PNG 1024px). Se usa como ilustración real, no como
  decoración repetida: sello de PWA, marca en la navegación, imagen de la app.
- El audio del seed es TTS local (voces de Windows). La interfaz lo marca como voz
  sintética; el equipo reemplaza las pistas por grabaciones reales.
- Sin reseñas de ejemplo en la base: la lista de guías arranca con el estado vacío
  diseñado, no con reseñas inventadas.

## Contrato de dirección

**THESIS:** EcoGuide se presenta como una campaña de láminas impresas donde cada
destino es una hoja con su propia tinta; rechaza la portada de app de ecoturismo
—verde degradado, tarjeta redondeada con ícono, botón azul— y la sustituye por
papel, tinta plana y un mapa que funciona de verdad en la primera pantalla.

**OWN-WORLD:** papel arena `#EADEC0` con grano de offset, tinta petróleo `#0F3246`
como color principal, terracota `#A8501C` como único acento de acción, turquesa
`#3FB5B8` para el agua y el mapa, oliva `#5A6B3C` para lo vivo. Componentes planos:
sin sombras suaves, sin degradados, sin desenfoques; las separaciones son reglas de
tinta de 1 a 2 px. Esquinas de 2 px, no de 16 px: es una impresión, no una tarjeta.
Tipografía: Archivo variable condensada (wdth 62 a 75) para titulares de cartel,
Archivo a ancho normal para interfaz, Azeret Mono para coordenadas, distancias y
alturas. Sin cristal esmerilado, sin neón, sin brillo.

**STORY:** el visitante entiende en el primer viewport que esto es Formosa, que el
mapa funciona sin conexión y que hay una voz local contándole lo que ve; y puede
entrar al mapa, instalar la app o publicar una guía. La prueba es el mapa real y los
audios reales, no una promesa.

**FIRST VIEWPORT:** hoja a sangre. Titular condensado a dos líneas, de 112 a 132 px,
"Turismo Regional" sobre "& Naturaleza" en terracota, con la barra de tinta del
sello arriba y el descriptor chico debajo de un filete. A la derecha, el sello real
del logo recortado en círculo sobre un bloque turquesa plano, con dos piezas de
terracota y oliva desplazadas como viñetas de tinta. Abajo a la izquierda, el botón
de acción en terracota y el secundario en contorno de tinta. Debajo del pliegue,
comienza el mapa en vivo a ancho completo: sin él no hay primera pantalla.

**FORM:** afiche de propaganda turística — la forma elegida en la lista ordenada de
direcciones fundamentadas (posición 6 de 7), elegida por el seed `seed:271dd050666f6ded`.
Es la forma que hereda del logo del sello: ilustración naturalista de museo,
composición circular, tinta limitada. Sus reglas: composición por láminas,
jerarquía de cartel con titular condensado, filetes como estructura, color plano por
plancha, texto que se acomoda dentro de la imagen y no al lado, y movimiento de
tinta que se imprime.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.
