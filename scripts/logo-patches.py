"""Muestrea parches puntuales del logo y arma una hoja de contactos para verificar."""
import os, json, colorsys
from collections import Counter
from PIL import Image, ImageDraw

SRC = r"C:\Users\guill\Downloads\ecoguide-formosa-corregido\ecoguide-formosa\public\assets\logo.png"
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
im = Image.open(SRC).convert("RGB")
px = im.load()
W, H = im.size

POINTS = {
    "sky":        (416, 240),
    "sunset":     (700, 288),
    "sun":        (512, 384),
    "river":      (512, 480),
    "palm":       (280, 210),
    "bridge":     (620, 430),
    "heron":      (700, 560),
    "crocfull":   (300, 600),
    "orange":     (700, 645),
    "croc_head":  (500, 570),
    "teal_sky2":  (640, 230),
    "greens":     (360, 430),
}

def patch(x, y, r=7):
    cnt = Counter()
    for yy in range(y - r, y + r):
        for xx in range(x - r, x + r):
            rr, gg, bb = px[xx, yy]
            cnt[(rr // 8 * 8, gg // 8 * 8, bb // 8 * 8)] += 1
    (rr, gg, bb), _ = cnt.most_common(1)[0]
    return rr, gg, bb

sheet = Image.new("RGB", (len(POINTS) * 140, 170), "#FFFFFF")
d = ImageDraw.Draw(sheet)
out = {}
for i, (name, (x, y)) in enumerate(POINTS.items()):
    c = patch(x, y)
    out[name] = "#%02X%02X%02X" % c
    d.rectangle((i * 140 + 12, 12, i * 140 + 128, 128), fill=c, outline="#000000")
    d.text((i * 140 + 12, 136), name, fill="#000000")
    d.text((i * 140 + 12, 150), out[name], fill="#000000")
    print(name, (x, y), out[name])

sheet.save(os.path.join(ROOT, ".impeccable", "logo-patches.png"))
print(json.dumps(out, indent=1))
