---
name: EcoGuide Formosa
description: Cartel de propaganda turística impreso en papel, para el ecoturismo de la provincia de Formosa.
colors:
  papel-arena: "#EADEC0"
  papel-hondo: "#D6C396"
  papel-blanco: "#FBF8EF"
  tinta-petroleo: "#0F3246"
  tinta-profunda: "#19323C"
  terracota: "#A8501C"
  turquesa-rio: "#3FB5B8"
  oliva-chaco: "#5A6B3C"
  naranja-atardecer: "#F8A652"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 6rem)"
    fontWeight: 800
    fontVariation: "'wdth' 62"
    lineHeight: 0.88
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 3.5rem)"
    fontWeight: 800
    fontVariation: "'wdth' 100"
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  display-medio:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    fontVariation: "'wdth' 62"
    lineHeight: 1
  title:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    fontVariation: "'wdth' 62"
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  entradilla:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  cuerpo-chico:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.16em"
  dato:
    fontFamily: "Azeret Mono Variable, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 450
    fontFeature: "'tnum' 1"
    letterSpacing: "-0.01em"
  dato-medio:
    fontFamily: "Azeret Mono Variable, ui-monospace, monospace"
    fontSize: "0.9375rem"
    fontWeight: 450
    fontFeature: "'tnum' 1"
  dato-mini:
    fontFamily: "Azeret Mono Variable, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 450
    fontFeature: "'tnum' 1"
rounded:
  plancha: "2px"
  ficha: "2px"
  pastilla: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  bloque: "96px"
components:
  boton-terracota:
    backgroundColor: "{colors.terracota}"
    textColor: "{colors.papel-blanco}"
    rounded: "{rounded.plancha}"
    padding: "12px 20px"
    typography: "'wght' 650 / 0.9375rem"
  boton-terracota-hover:
    backgroundColor: "#C0642A"
  boton-tinta:
    backgroundColor: "{colors.tinta-petroleo}"
    textColor: "{colors.papel-arena}"
    rounded: "{rounded.plancha}"
    padding: "12px 20px"
  boton-contorno:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-petroleo}"
    rounded: "{rounded.plancha}"
    padding: "12px 20px"
    height: "44px"
  plancha:
    backgroundColor: "{colors.papel-blanco}"
    textColor: "{colors.tinta-petroleo}"
    rounded: "{rounded.plancha}"
    padding: "16px"
  campo:
    backgroundColor: "{colors.papel-blanco}"
    textColor: "{colors.tinta-petroleo}"
    rounded: "{rounded.ficha}"
    padding: "8px 12px"
    height: "44px"
  sello:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-petroleo}"
    rounded: "{rounded.ficha}"
    padding: "3px 8px"
    typography: "'wght' 650 / 0.6875rem / 0.1em"
---

# Design System: EcoGuide Formosa

## Overview

**Creative North Star: "La campaña impresa de la provincia"**

La interfaz es una carpeta de carteles de propaganda turística de los años sesenta: papel
arena con grano de offset, tinta petróleo en planchas separadas, terracota como único
acento de acción. No es una app de ecoturismo con fondo verde y tarjetas redondeadas:
es un impreso que se puede tocar, y por eso las separaciones son filetes de tinta, no
sombras; los bloques son planchas de color, no tarjetas con degradado; y la única
profundidad del sistema es el papel mismo.

El mundo viene del logo del proyecto, que ya es un emblema de reserva natural
ilustrado a cuatro tintas: el yacaré, la garza, las palmeras y la brújula. La paleta no
se inventó, se extrajo de esa imagen (`scripts/logo-palette2.py`), y el sistema entero
sale de ahí: papel, tinta, y un acento terracota para las acciones.

**Key Characteristics:**

- Tinta plana sobre papel con grano. Sin degradados, sin vidrio esmerilado, sin neón.
- Filetes de 1 y 2 px como estructura; el borde de 2 px marca los bloques mayores.
- Esquinas de 2 px: es una impresión, no una tarjeta de interfaz.
- El titular se imprime condensado (`wdth` 68) y pesa; la interfaz usa el ancho normal.
- Los números —coordenadas, distancias, alturas, porcentajes— van en monoespaciada con
  cifras tabulares, como la columna de medidas de una carta topográfica.
- La escala tipográfica es de cartel: el titular puede pasar los 96 px porque en un
  afiche de turismo el titular es lo más grande de la lámina.

## Colors

Paleta de cuatro tintas sobre papel, extraída del logo maestro del proyecto.

### Primary

- **Tinta petróleo** (`#0F3246`): color principal. Texto, filetes, iconografía, botones
  primarios de tinta y el fondo de las secciones de inversa (pie de página, bloque del
  mapa en la landing). Es el color con el que se "imprime" el texto.
- **Papel arena** (`#EADEC0`): el suelo. Fondo de la aplicación completa y de las
  secciones largas. Lleva la textura de papel generada en `public/textures/paper.png`.

### Secondary

- **Terracota** (`#A8501C`): el único acento de acción. Botón principal, subrayados de
  enlace, franja de la tirada de tinta, chips activos y datos destacados. Aparece poco
  y siempre significa "esto se puede hacer".
- **Turquesa río** (`#3FB5B8`): el agua. Bloques de color planos, viñetas del sello,
  acentos de mapa, bordes de los clips verticales.

### Tertiary

- **Oliva Chaco** (`#5A6B3C`): lo vivo. Folaje del sello, difficulties fáciles de las
  rutas, estados verificados.
- **Naranja atardecer** (`#F8A652`): atardecer sobre el Bermejo. Solo en las láminas
  verticales generadas y en los estados de dificultad media.

### Neutrals

- **Papel blanco** (`#FBF8EF`): superficies elevadas sobre el papel arena: planchas,
  campos de formulario, reproductor de audio.
- **Papel hondo** (`#D6C396`): bandas de arena de las láminas y fondos de mapa sin tiles.
- **Tinta profunda** (`#19323C`): el modo oscuro completo — el papel pasa a ser tinta y
  el texto pasa a ser arena. Se elige con el conmutador de la barra superior.

## Typography

Dos familias, self-hosted en `src/fonts/`.

**Archivo Variable** es la voz completa del sistema. Tiene dos registros distintos:

- `.display` — titular de cartel: `font-variation-settings: "wdth" 68, "wght" 800`,
  `line-height: 0.88`, `letter-spacing: -0.025em`. Se usa en el titular de la portada,
  en los nombres de los puntos, de las rutas y de los módulos. El ancho condensado es lo
  que hace que el titular se lea como un afiche y no como un `<h1>` de SaaS.
- `.display-wide` — titular de sección: mismo peso, `wdth` 100, `line-height: 0.95`.
  Se usa donde el texto tiene que leerse rápido (encabezados de sección, títulos de
  tarjeta, nombres en listas).

`.label` es el rótulo funcional: 11 px, `wght` 600, `letter-spacing: 0.16em`,
mayúsculas. Es la nomenclatura de un impreso —tablas, índices, metadatos— y **nunca**
un antetítulo sobre un encabezado: cuando hace falta nombrar una sección, el nombre va
dentro del bloque de metadatos, no encima del título.

`.measure` es la voz de los datos: **Azeret Mono Variable**, `wght` 450, con cifras
tabulares activadas en todos los elementos `<table>`, `<time>` y `.measure`. Coordenadas,
distancias, alturas, porcentajes, códigos de señalética y duración de los clips.

El cuerpo del texto se limita a `max-width: 68ch` (`.measure-wide`): en pantalla de
teléfono, la medida se reduce sola.

## Layout

- Contenedor `max-w-7xl` (1280 px) con `px-4 / sm:px-6 / lg:px-8`.
- La portada usa una grilla de 12 columnas: 7 para el titular y el texto, 5 para el
  sello. A menos de 1024 px las columnas se apilan y el sello baja debajo del texto.
- Ritmo vertical: una sección cada `py-20` en móvil y `py-28` en escritorio. Entre
  secciones hay una regla de 2 px en tinta. **Más espacio arriba de un encabezado que
  debajo**: el espacio que sigue al título es el que lo separa del contenido.
- Las listas largas son índices impresos: filas separadas por filetes de 1 px, con
  filete de 2 px arriba del primer elemento. Nunca una grilla de tarjetas iguales.
- Puntos de quiebre: 640 / 768 / 1024 / 1280 / 1536 px (Tailwind por defecto).

## Elevation & Depth

**El sistema es plano.** No hay sombras.

La profundidad se resuelve con el orden del material y el contraste de tinta:

| Capa | Superficie | Borde |
| --- | --- | --- |
| Suelo | papel arena con grano | — |
| Plancha | papel blanco | filete 1 px de tinta al 22 % |
| Acción | terracota o tinta, planos | ninguno o 2 px |
| Inversa | tinta petróleo | filete 1 px de arena |

Donde hace falta un realce —el popup del mapa, el aviso emergent— se usa un borde de
tinta de 1 px y nada más. La única sombra del sistema es la que dibuja el propio
sistema de impresión: un desregistro de 2 px entre planchas durante la tirada.

## Shapes

- Radio por defecto: **2 px** (`--radius-plate`, `--radius-chip`). Es una impresión
  recortada, no una tarjeta redondeada.
- `--radius-pill` (999 px) solo para controles circulares pequeños: el punto de
  concentración en el mapa, el avatar de un guía.
- Los bloques de color no llevan sombra ni degradado: son planchas de tinta.
- El sello del proyecto se recorta en círculo con alfa (`public/brand/sello.png`), sin
  borde: flota sobre la plancha de color.

## Components

**Botones** (`.btn`, 44 px de alto mínimo, `scale(0.975)` al presionar):

- `.btn-primary` — terracota, la acción principal de la pantalla.
- `.btn-ink` — tinta petróleo, acción secundaria dentro de bloques oscuros.
- `.btn-ghost` — sin fondo, borde de tinta al 55 %, la acción terciaria o el "cancelar".

**Plancha** (`.plate`) — superficie elevada con filete. Contiene fichas, el reproductor
de audio, los formularios del panel y los bloques de la portada.

**Sello** (`.stamp`) — rótulo de estado con borde de 1 px del color que lo define:
terracota para pendiente, oliva para aprobado, tinta para lo informativo. Se usa en
chips de filtro, estados de moderación y metadatos.

**Campo** (`.field`) — rectángulo con borde de tinta, relleno papel blanco, foco con
anillo terracota de 3 px.

**Filete** (`.rule` 1 px / `.rule-strong` 2 px / `.rule-ink` 3 px) — toda la
estructura del sistema. Los filetes separan; no las sombras.

**Reproductor de audio** — plancha con el título en `.display`, barra de progreso de
1.5 px en terracota sobre pista al 15 % de tinta, botón principal de 44 px en tinta
petróleo. El selector de idioma es un grupo de botones contiguos, no un desplegable.

**Cápsula de módulo** (índice de la portada) — fila con bloque de color, título en
`.display` y descripción. Al pasar el cursor el título se desplaza 1 px hacia la
derecha y la flecha acompaña: el gesto es el de una hoja que se pasa.

## Do's and Don'ts

- **Hacé**: usá el terracota solo para acciones. Si dos elementos compiten por atención,
  uno es la acción y el otro es un enlace con subrayado terracota.
- **Hacé**: poné los números en `.measure`. Coordenadas, distancias y alturas se leen
  como medidas, no como texto.
- **Hacé**: separá con filetes. El ritmo vertical se construye con reglas, no con
  sombras.
- **No uses** degradados, sombras suaves, `backdrop-filter` ni vidrio esmerilado: no
  pertenecen a una litografía.
- **No uses** texto con degradiente ni resplandor. La jerarquía sale del peso y del
  tamaño, nunca del color de la letra.
- **No pongas** un rótulo o antetítulo encima de un encabezado. El encabezado habla
  solo; si hace falta nombrar algo, va en el bloque de metadatos.
- **No uses** una fila de tarjetas iguales con ícono, título y texto como estructura de
  página: es el esqueleto por defecto de toda app. Usá un índice impreso con filetes.
- **No inventes** reseñas, calificaciones, cifras de visitas ni testimonios. Cuando no
  hay datos, el estado vacío lo dice y explica por qué.
- **No uses** `ease-in` en la interfaz: siempre `ease-out` o `ease-in-out`.
- **No uses** sombras duras tipo `4px 4px 0` salvo dentro de este mundo impreso, y
  acá no se usan.
- **No uses** emoji ni glifos Unicode como iconos: los iconos salen de una sola librería
  (Lucide) con un único grosor de trazo.
