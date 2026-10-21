"""
Recorta el sello del logo a un circulo con alfa, para usarlo como ilustracion
flotante sobre los bloques de tinta (sin el cuadrado blanco de la tarjeta).

  python scripts/badge-mask.py
"""
import os
from PIL import Image, ImageDraw

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SRC = os.path.join(ROOT, "public", "brand", "logo.png")
OUT = os.path.join(ROOT, "public", "brand", "badge.png")

im = Image.open(SRC).convert("RGBA")
W, H = im.size

# El sello (crema + tinta) va de 86 a 938 en x, de 76 a 948 en y.
cx, cy, r = 512, 512, 436
pad = 6
mask = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(mask)
d.ellipse([cx - r + pad, cy - r + pad, cx + r - pad, cy + r - pad], fill=255)

out = im.copy()
out.putalpha(mask)
side = r * 2
out = out.crop((cx - r, cy - r, cx + r, cy + r)).resize((1024, 1024), Image.LANCZOS)
out.save(OUT, optimize=True)

check = Image.open(OUT)
print("badge:", OUT, check.size, check.mode, "alfa extrema:", check.getextrema()[3])
