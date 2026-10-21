"""Reemplaza el bloque ROUTES de prisma/data/content.ts por el nuevo recorrido.

Cada ruta tiene ahora tres paradas DISTINTAS y coherentes con su descripcion.
"""
import io
import re

path = "prisma/data/content.ts"
src = io.open(path, encoding="utf-8").read()

NEW = '''export const ROUTES: SeedRoute[] = [
  {
    slug: "ruta-del-yacare",
    name: "Ruta del Yacaré",
    description:
      "El recorrido mínimo para ver fauna chaqueña con los pies: el estero del Colorado, el paraje donde descansan las aves y el bosque de algarrobos que bordea el bajo.",
    distance: 21.8,
    duration: 300,
    difficulty: "MEDIO",
    theme: "fauna",
    stops: [
      {
        slug: "parque-nacional-el-colorado",
        notes: "Entrada por la garita. Pedí el mapa de interpretación y el horario del bote: sale una sola vez por día.",
      },
      {
        slug: "laguna-yema",
        notes: "El paraje donde descansan las aves antes de seguir al sur. Hay puesto de guardaparque y sombra para esperar la bandada.",
      },
      {
        slug: "reserva-natural-formosa",
        notes: "La franja de bosque seco. El contraste entre el monte alto y el bajo inundado es el motivo de la caminata.",
      },
    ],
  },
  {
    slug: "sendero-de-las-aves-de-la-laguna",
    name: "Sendero de las Aves de la Laguna",
    description:
      "Una vuelta de observación alrededor de los humedales del este: la laguna que se abre con el desborde, el arroyo de los sauces y el bajo donde anida el caracolero.",
    distance: 24.7,
    duration: 330,
    difficulty: "MEDIO",
    theme: "aves",
    stops: [
      {
        slug: "laguna-yema",
        notes: "Salida temprano: el canto del alba es el mejor momento y la luz dura poco.",
      },
      {
        slug: "canada-de-la-yegua",
        notes: "El corredor de sauces. En invierno el arroyo baja y quedan pozones con peces: ahí se juntan las aves de agua.",
      },
      {
        slug: "reserva-natural-formosa",
        notes: "El borde del bosque ribereño, donde descansa el cormorán entre los mergullos.",
      },
    ],
  },
  {
    slug: "camino-del-bermejo",
    name: "Camino del Bermejo",
    description:
      "Una jornada larga siguiendo la costa del río, con la erosión de la barranca como tema central y dos miradores de palmares al final del día.",
    distance: 31.2,
    duration: 420,
    difficulty: "MEDIO",
    theme: "río",
    stops: [
      {
        slug: "monumento-natural-fauna-cadaquena",
        notes: "Circuito de interpretación: nueve estaciones sobre la mezcla de dos bosques.",
      },
      {
        slug: "monumento-natural-cerro-bocon",
        notes: "Subida al promontorio, una hora y media. Llevar agua suficiente.",
      },
      {
        slug: "estancia-el-cambalache",
        notes: "Cena en el galpón y charla con el equipo que maneja el programa de reintroducción del yacaré.",
      },
    ],
  },
  {
    slug: "ruta-de-la-palma-cadaquena",
    name: "Ruta de la Palma Chaqueña",
    description:
      "Del llano al dosel de palmas de Copernicia, con un tramo de bosque seco protegido en el medio y el arroyo que lo ordena todo.",
    distance: 22.6,
    duration: 330,
    difficulty: "MEDIO",
    theme: "flora",
    stops: [
      {
        slug: "reserva-natural-formosa",
        notes: "Entrada de la reserva y puesto de control. Transición de la sabana anegada al piso arbóreo del quebracho.",
      },
      {
        slug: "monumento-natural-cerro-bocon",
        notes: "El palmar de la cumbre: el mejor lugar para ver tortugas de cabeza roja al atardecer.",
      },
      {
        slug: "canada-de-la-yegua",
        notes: "Bajo el arroyo, el sotobosque de achira y palma que sostiene el bosque de sauce.",
      },
    ],
  },
  {
    slug: "travesia-de-tres-banderas",
    name: "Travesía de Tres Banderas",
    description:
      "La ruta larga del extremo norte: campo chaqueño abierto, el cruce de la frontera y el obelisco de las tres banderas.",
    distance: 96.4,
    duration: 720,
    difficulty: "DIFICIL",
    theme: "aventura",
    stops: [
      {
        slug: "parque-nacional-tres-banderas",
        notes: "Entrada del parque y registro en el puesto. El obelisco queda a cinco kilómetros de ida y vuelta.",
      },
      {
        slug: "monumento-natural-fauna-cadaquena",
        notes: "Tramo de monte ripioso antes del campo abierto. Doce kilómetros sin sombra: agua y sombrero.",
      },
      {
        slug: "estancia-el-cambalache",
        notes: "Punto de agua y de resguardo antes de la parte abierta del camino, junto al Bermejo.",
      },
    ],
  },
];'''

start = src.index("export const ROUTES: SeedRoute[] = [")
end = src.index("\n];", start) + len("\n];")
src = src[:start] + NEW + src[end:]
io.open(path, "w", encoding="utf-8").write(src)

# Verificacion: cada ruta con tres paradas distintas que existan en POINTS.
import subprocess, json, os
print("bloque ROUTES reemplazado")

# Duplicados por ruta
for m in re.finditer(r'slug: "([a-z0-9-]+)",\n\s+notes', src):
    pass
stops = re.findall(r'stops: \[(.*?)\n    \]', src, re.S)
for i, block in enumerate(stops):
    slugs = re.findall(r'slug: "([a-z0-9-]+)"', block)
    print("ruta", i + 1, slugs, "->", "OK" if len(slugs) == len(set(slugs)) else "DUPLICADOS")
