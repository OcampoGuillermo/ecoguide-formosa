"""Analiza el logo maestro: detecta el circulo del sello y extrae la paleta."""
import os, json
from collections import Counter
from PIL import Image

SRC = r"C:\Users\guill\Downloads\WhatsApp Image 2026-10-20 at 6.27.05 PM.jpeg"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "brand")
os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGB")
W, H = im.size
px = im.load()
print("size", W, H)

# La tinta principal del sello (verde petroleo oscuro) se detecta por ser muy oscura
# y saturada hacia el cyan/verde; el papel es casi blanco.
def is_ink(r, g, b):
    mx, mn = max(r, g, b), min(r, g, b)
    return mx < 130 and (mx - mn) > 25

xs, ys = [], []
step = 2
for y in range(0, H, step):
    for x in range(0, W, step):
        r, g, b = px[x, y]
        if is_ink(r, g, b):
            xs.append(x); ys.append(y)

print("ink px:", len(xs))
if xs:
    bbox = (min(xs), min(ys), max(xs), max(ys))
    print("ink bbox:", bbox, "size:", bbox[2]-bbox[0], bbox[3]-bbox[1])
    cx = (bbox[0]+bbox[2])//2; cy = (bbox[1]+bbox[3])//2
    r = max(bbox[2]-bbox[0], bbox[3]-bbox[1])//2
    print("circle center", cx, cy, "r", r)
else:
    bbox = None

# Paleta: cuantiza la imagen completa y separa los clusters grandes
small = im.resize((256, 256))
q = small.quantize(colors=12, method=Image.MEDIANCUT).convert("RGB")
cnt = Counter(q.getdata())
total = sum(cnt.values())
pal = []
for (r, g, b), n in cnt.most_common(12):
    pal.append({"hex": "#%02X%02X%02X" % (r, g, b), "pct": round(100*n/total, 2)})
print("palette:", json.dumps(pal, indent=1))
