"""Dibuja una grilla de coordenadas sobre el logo para calibrar regiones."""
import os
from PIL import Image, ImageDraw

SRC = r"C:\Users\guill\Downloads\ecoguide-formosa-corregido\ecoguide-formosa\public\assets\logo.png"
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
im = Image.open(SRC).convert("RGB")
d = ImageDraw.Draw(im)
for x in range(0, im.width, 64):
    d.line((x, 0, x, im.height), fill=(255, 0, 255), width=1)
    d.text((x + 2, 2), str(x), fill=(255, 0, 255))
for y in range(0, im.height, 64):
    d.line((0, y, im.width, y), fill=(0, 255, 255), width=1)
    d.text((2, y + 2), str(y), fill=(0, 200, 255))
out = os.path.join(ROOT, ".impeccable", "logo-grid.png")
os.makedirs(os.path.dirname(out), exist_ok=True)
im.save(out)
print(out)
