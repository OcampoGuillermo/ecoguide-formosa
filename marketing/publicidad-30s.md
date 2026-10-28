# Campaña «Salí a escuchar el territorio»

Paquete de publicidad de EcoGuide Formosa: spot de 30 s, seis piezas hiperrealistas y
capturas reales de la app en los dos formatos.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `marketing/spot-30s.mp3` | Locución de 29,93 s, 48 kHz estéreo, −16 LUFS |
| `marketing/spot-guion.txt` | Texto plano de la locución |
| `marketing/shots/portada-16x9.png` | Captura real 1920×1080 de la portada |
| `marketing/shots/mapa-16x9.png` | Captura real 1920×1080 del mapa |
| `marketing/shots/ficha-16x9.png` | Captura real 1920×1080 de una ficha |
| `marketing/shots/portada-9x16.png` | Captura real 1080×1920 (layout móvil) |
| `marketing/shots/mapa-9x16.png` | Captura real 1080×1920 (layout móvil) |
| `marketing/shots/ficha-9x16.png` | Captura real 1080×1920 (layout móvil) |

Las capturas salen de la app en producción con `scripts/cdp-shot.mjs`, sin retoques:
sirven para probar el encuadre y para reemplazar la pantalla del teléfono en las
piezas generadas.

> **Voz:** Windows solo tiene español de España (Helena). Para la versión final conviene
> una locución rioplatense real, o una voz latinoamericana de ElevenLabs. El texto y los
> tiempos ya están resueltos: se puede regrabar sin tocar el guion.

---

## 1. Guion del spot (30 s)

Tiempos medidos sobre el audio entregado. La locución va sin música en la primera
mitad; entra un pulso grave y percusión suave a los 0:10.

| Tiempo | Locución | Texto en pantalla | Imagen |
| --- | --- | --- | --- |
| 0:00–0:02 | Formosa no se explica desde una vidriera. | — | Amanecer en el monte chaqueño. Viento en las hojas. |
| 0:02–0:07 | Se escucha en el monte, se camina en la costanera, se aprende de quien vive acá. | — | Tres cortes: sendero, costanera, manos de un guía. |
| 0:07–0:12 | EcoGuide Formosa reúne las audioguías, los mapas y las rutas de la provincia en tu teléfono. | **Audioguías · Mapa · Rutas** | Teléfono en mano; pantalla real de la app. |
| 0:12–0:16 | Escaneás el código del sendero y la historia empieza a hablar. | **Escaneá el QR** | QR en un cartel de madera; el pulgar lo enfoca. |
| 0:16–0:19 | Funciona sin señal, con la voz de los guías locales. | **Sin señal. Sin excusas.** | Persona en un paraje sin cobertura, la app abierta. |
| 0:19–0:25 | Doce puntos. Cinco rutas. Una provincia entera para descubrir. | **12 puntos · 5 rutas** | Mapa que se aleja hasta mostrar Formosa completa. |
| 0:25–0:30 | EcoGuide Formosa. Descargala gratis y salí a escuchar el territorio. | **ecoguide-formosa-one.vercel.app** | Logo sobre la costanera al atardecer. QR en pantalla. |

**Cierre de marca (últimos 3 s):** logo, URL y QR. Sin precio, sin promesas de descuento:
la propuesta es gratuita y pública.

**Mezcla:** voz −16 LUFS, música −24 LUFS, efecto de río y aves por debajo de −30 LUFS.
Ducking de la música 3 dB cuando habla la voz.

---

## 2. Seis piezas hiperrealistas

Estilo base para todas (agregar al final de cada prompt):

```text
hyperrealistic editorial advertising photograph, shot on ARRI Alexa 35,
35mm Master Prime, f/2.0, shallow depth of field, golden hour rim light,
natural skin texture with visible pores, fine 35mm film grain,
Kodak Portra 400 color science, cinematic contrast, subtle halation,
brand palette: cream #F5EFE0, ink blue #0E2A3A, terracotta #B4552D,
olive green #6B7A4F, turquoise #2FA3B5, no text, no watermark,
phone screen kept flat and evenly lit for screen replacement
```

Cada prompt está pensado para **reemplazar la pantalla** con las capturas reales: pedir
UI legible a un generador de imágenes produce texto roto. La pantalla se compone en post.

### Pieza 1 — «La puerta de entrada»

**Comunica:** la app es la puerta al territorio y la abre una persona real, no un logo.

**16:9 (1920×1080)**

```text
A 45-year-old Argentine park ranger with weathered skin and a canvas hat stands at
the edge of a misty Chaco woodland at sunrise, holding a smartphone at chest height.
Warm backlight cuts through quebracho trees, birds in flight far behind. Subject on
the left third, generous negative space on the right for a headline. Wide cinematic
composition, dew on grass, dust motes in the light beams.
```

**9:16 (1080×1920)** — mismo lugar, encuadre a la cintura, teléfono levantado hacia la
cámara; 15 % de aire arriba para el gancho y 20 % abajo para el CTA.

### Pieza 2 — «La voz del sendero»

**Comunica:** escaneás el QR del sendero y la historia empieza a hablar.

**16:9**

```text
Extreme close-up of a hiker's hand holding a phone in front of a weathered wooden
trail sign with a QR code, deep green monte bokeh behind, dappled sunlight through
leaves, sweat and dirt on the skin, 100mm macro lens, razor-thin focus on the QR.
The phone screen is a clean bright rectangle, slightly angled, catching a soft
reflection of the canopy.
```

**9:16** — vertical: QR arriba, mano y teléfono abajo; el sendero se pierde en el fondo.

### Pieza 3 — «El mapa en la mano»

**Comunica:** las rutas y el mapa se consultan antes de salir, en el vehículo.

**16:9**

```text
A couple in their thirties leaning on the hood of a dusty 4x4 at a lookout over the
Bermejo river, late afternoon. The woman holds a tablet showing a map; the man points
at the horizon. Dust hangs in the air, warm terracotta light, river valley below.
Wide environmental shot, vehicle and landscape readable, screen flat and evenly lit.
```

**9:16** — la pareja en el tercio inferior, el valle y el cielo ocupan el resto.

### Pieza 4 — «Sin señal»

**Comunica:** funciona sin cobertura, en el lugar y en el sendero.

**16:9**

```text
A lone traveler with a backpack stands on a remote dirt track in Formosa, phone in
hand, smiling with quiet confidence. Vast flat landscape, dramatic storm clouds
breaking into late sun, no buildings, no antennas. Strong negative space in the sky,
high contrast between the dark clouds and the warm ground.
```

**9:16** — figura pequeña en el centro-abajo, cielo tormentoso dominando el cuadro.

### Pieza 5 — «Los que saben»

**Comunica:** la voz es de guías locales, no de una máquina ni de un catálogo.

**16:9**

```text
Environmental portrait of a 50-year-old local guide of Guaraní heritage on the
Formosa waterfront at golden hour, looking straight into the lens, calm and proud.
Weathered hands hold a phone at waist level. Warm rim light on the face, river and
palms softly blurred behind, authentic skin texture, no makeup, documentary honesty.
```

**9:16** — retrato cerrado, ojos en el tercio superior, teléfono visible abajo.

### Pieza 6 — «La noche también escucha»

**Comunica:** la app también acompaña la costanera y la ciudad de noche.

**16:9**

```text
A young traveler at night on the Formosa waterfront, face lit by the glow of a phone,
city lights and river reflections as soft bokeh behind. Cool teal shadows, warm
terracotta highlights, light wind in the hair, cinematic 50mm portrait, film grain.
```

**9:16** — rostro y pantalla en el centro, reflejos del río en la mitad inferior.

### Negative prompt (todas)

```text
text, letters, watermark, logo, distorted hands, extra fingers, plastic skin,
oversaturated HDR, fake bokeh, cartoon, illustration, 3D render, low resolution,
blurry UI, garbled screen content, duplicate subjects, deformed face
```

### Ajustes por formato

| Formato | Uso | Reglas |
| --- | --- | --- |
| 16:9 · 1920×1080 | YouTube, web, presentaciones | Sujeto fuera del centro; titular en el tercio libre |
| 9:16 · 1080×1920 | Reels, TikTok, Stories | Sujeto centrado; 250 px libres arriba y abajo; texto grande |

---

## 3. Simulación de ejecución real

Las seis piezas muestran la app **funcionando**, no un mockup dibujado. Flujo:

1. **Capturar** la app real en los dos formatos (ya hecho):
   `node scripts/cdp-shot.mjs <url> <salida.png> 1920 1080` y
   `node scripts/cdp-shot.mjs <url> <salida.png> 540 960 --dpr=2`.
2. **Generar** la escena con la pantalla plana y bien iluminada.
3. **Reemplazar** la pantalla: corner-pin de la captura, `Multiply` al 85 %, reflejo
   suave al 12 %, grano y desenfoque de movimiento iguales al resto del cuadro.
4. **Animar** (opcional): scroll vertical de la captura dentro de la pantalla, 8 px/s,
   para que se lea como app viva.
5. **Exportar** 16:9 H.264 10 Mbps y 9:16 H.264 10 Mbps, audio AAC 192 kbps.

**Ojo con el dato «0 guías»:** la portada real muestra 0 porque todavía no hay perfiles
reales. Cuando se registren, la captura cambia sola; mientras tanto, recortar esa línea
o capturar después de la primera guía verificada.

---

## 4. Orden de publicación sugerido

1. Pieza 5 (retrato) como presentación: la cara humana abre la conversación.
2. Pieza 4 («sin señal») como prueba de producto.
3. Pieza 2 (QR) como tutorial de 15 s.
4. Pieza 6 (noche) para fin de semana.
5. Pieza 1 y 3 como cierre de campaña, con el spot de 30 s.
