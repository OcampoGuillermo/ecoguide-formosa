"""Genera la textura de papel del cartel (grano de offset, sin costura)."""
import os, math, random
from PIL import Image, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
OUT = os.path.join(ROOT, "public", "textures")
os.makedirs(OUT, exist_ok=True)

SIZE = 340
random.seed(20261021)

# Grano de fibra: ruido gaussiano muy suave, con veta horizontal leve.
noise = Image.effect_noise((SIZE, SIZE), 26).convert("L").filter(ImageFilter.GaussianBlur(0.6))

paper = Image.new("RGB", (SIZE, SIZE), (234, 222, 192))
px = paper.load()
np = noise.load()

# Ondas de fibra,wrapped para que sea continuo
for y in range(SIZE):
    for x in range(SIZE):
        wave = 3.0 * math.sin((x / SIZE) * math.pi * 2 * 3 + 0.7) * math.sin((y / SIZE) * math.pi * 2 * 5)
        d = (np[x, y] - 128) * 0.10 + wave
        r, g, b = px[x, y]
        px[x, y] = (
            max(0, min(255, int(r + d))),
            max(0, min(255, int(g + d))),
            max(0, min(255, int(b + d))),
        )

paper = paper.filter(ImageFilter.SMOOTH)
paper.save(os.path.join(OUT, "paper.png"), optimize=True)

# Textura de trama (pantalla de medio tono) para los bloques de tinta grandes.
DOT = 4
screen = Image.new("RGBA", (DOT * 2, DOT * 2), (0, 0, 0, 0))
sp = screen.load()
for y in range(DOT * 2):
    for x in range(DOT * 2):
        if (x + y) % 2 == 0:
            sp[x, y] = (0, 0, 0, 26)
screen.save(os.path.join(OUT, "halftone.png"), optimize=True)

print("texturas:", os.listdir(OUT))
