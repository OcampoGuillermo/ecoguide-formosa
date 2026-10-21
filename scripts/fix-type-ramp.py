"""Alinea los tamanos de letra del codigo a la rampa documentada en DESIGN.md.

Rampa (rem): 0.6875 / 0.75 / 0.875 / 1 / 1.125 / 1.25 / 1.5 / 1.75 / 2 / 2.25 / 2.5 / 3.5 / 4.5 / 6
"""
import io
import glob
import re

MAP = [
    # micros
    ("text-[0.6rem]", "text-[0.6875rem]"),
    ("0.6rem", "0.6875rem"),
    ("0.68rem", "0.6875rem"),
    ("0.72rem", "0.75rem"),
    # cuerpo chico
    ("0.82rem", "0.875rem"),
    ("0.85rem", "0.875rem"),
    ("0.88rem", "0.875rem"),
    ("0.9rem", "0.875rem"),
    ("0.92rem", "0.875rem"),
    ("0.9375rem", "0.875rem"),
    # cuerpo
    ("0.95rem", "1rem"),
    ("1.05rem", "1rem"),
    ("1.0625rem", "1.125rem"),
    ("1.1rem", "1.125rem"),
    ("1.15rem", "1.125rem"),
    # titulos
    ("1.2rem", "1.25rem"),
    ("1.3rem", "1.25rem"),
    ("1.35rem", "1.5rem"),
    ("1.4rem", "1.5rem"),
    ("1.6rem", "1.75rem"),
    # px sueltos (popup del mapa)
    ("10.5px", "0.6875rem"),
    ("13px", "0.8125rem"),
    ("15px", "0.9375rem"),
    ("10px", "0.6875rem"),
]

files = glob.glob("src/**/*.tsx", recursive=True) + glob.glob("src/**/*.css", recursive=True)
changed = {}

for path in files:
    src = io.open(path, encoding="utf-8").read()
    out = src
    for old, new in MAP:
        out = out.replace(old, new)
    # 1.25rem -> 1.5rem accidental? no: MAP is ordered, 1.3rem->1.25rem happens
    # before 1.35rem->1.5rem, pero "1.3rem" no es subcadena de "1.35rem".
    if out != src:
        io.open(path, "w", encoding="utf-8").write(out)
        changed[path] = sum(1 for a, b in zip(src.split("\n"), out.split("\n")) if a != b)

print("archivos ajustados:", len(changed))
for k, v in sorted(changed.items()):
    print("  %-58s %d lineas" % (k, v))

# Sizes now present
sizes = set()
for path in files:
    for m in re.finditer(r"text-\[([0-9.]+rem)\]", io.open(path, encoding="utf-8").read()):
        sizes.add(m.group(1))
    for m in re.finditer(r"font-size:\s*([0-9.]+rem)", io.open(path, encoding="utf-8").read()):
        sizes.add(m.group(1))
print("\ntamanos en uso:", sorted(sizes, key=lambda s: float(s)))
