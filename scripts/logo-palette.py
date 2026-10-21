"""Extrae la paleta real del logo por cubos de tono y satura."""
import os, json, colorsys
from collections import Counter
from PIL import Image

SRC = r"C:\Users\guill\Downloads\WhatsApp Image 2026-10-20 at 6.27.05 PM.jpeg"

im = Image.open(SRC).convert("RGB")
W, H = im.size

# Solo el interior del sello (bbox de tinta Detectado: 86..936 / 76..950)
im2 = im.crop((100, 90, 925, 940))
im2 = im2.resize((420, 426))
px = im2.load()
w, h = im2.size

buckets = Counter()
for y in range(h):
    for x in range(w):
        r, g, b = px[x, y]
        hsv = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        hue, sat, val = hsv
        deg = int(hue * 360)
        if val < 0.22:
            buckets["ink_dark"] += 1
        elif sat < 0.13:
            buckets["paper"] += 1
        elif val < 0.42:
            buckets["deep"] += 1
        elif 150 <= deg <= 205:
            buckets["teal"] += 1
        elif 205 <= deg <= 260:
            buckets["river"] += 1
        elif 15 <= deg <= 48:
            buckets["terracotta"] += 1
        elif 48 <= deg <= 95:
            buckets["olive"] += 1
        elif 95 <= deg <= 150:
            buckets["green"] += 1
        else:
            buckets["other"] += 1

total = sum(buckets.values())
print({k: round(100 * v / total, 1) for k, v in buckets.most_common()})

# color dominante de cada bucket (promedio ponderado de los pixeles members)
groups = {k: [] for k in buckets}
for y in range(h):
    for x in range(w):
        r, g, b = px[x, y]
        hue, sat, val = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        deg = int(hue * 360)
        if val < 0.22: k = "ink_dark"
        elif sat < 0.13: k = "paper"
        elif val < 0.42: k = "deep"
        elif 150 <= deg <= 205: k = "teal"
        elif 205 <= deg <= 260: k = "river"
        elif 15 <= deg <= 48: k = "terracotta"
        elif 48 <= deg <= 95: k = "olive"
        elif 95 <= deg <= 150: k = "green"
        else: k = "other"
        groups[k].append((r, g, b))

out = {}
for k, vals in groups.items():
    if not vals:
        continue
    # toma el 25% mas saturado y claro como representativo
    vals_s = sorted(vals, key=lambda c: -(max(c) - min(c)))
    rep = vals_s[: max(1, len(vals_s) // 8)]
    r = sum(c[0] for c in rep) // len(rep)
    g = sum(c[1] for c in rep) // len(rep)
    b = sum(c[2] for c in rep) // len(rep)
    out[k] = "#%02X%02X%02X" % (r, g, b)

print(json.dumps(out, indent=1))
