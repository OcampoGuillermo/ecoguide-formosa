"""Muestrea regiones concretas del logo para fijar la paleta de marca."""
import colorsys, json
from PIL import Image

SRC = r"C:\Users\guill\Downloads\WhatsApp Image 2026-10-20 at 6.27.05 PM.jpeg"
im = Image.open(SRC).convert("RGB")
px = im.load()

def darkest(x0, y0, x1, y1):
    """Pixel mas oscuro del area: el color de la tinta."""
    best, best_sum = None, -1
    for y in range(y0, y1, 2):
        for x in range(x0, x1, 2):
            r, g, b = px[x, y]
            s = r + g + b
            if s > best_sum:
                best_sum, best = s, (r, g, b)
    return best

def vivid(x0, y0, x1, y1, prefer="sat"):
    """Pixel mas saturado del area."""
    best, best_key = None, -1
    for y in range(y0, y1, 2):
        for x in range(x0, x1, 2):
            r, g, b = px[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if v < 0.3:
                continue
            key = s if prefer == "sat" else v
            if key > best_key:
                best_key, best = key, (r, g, b)
    return best

def hexc(c):
    return None if c is None else "#%02X%02X%02X" % c

regions = {
    "wordmark_EcoGuide": (250, 690, 770, 775),
    "FORMOSA":           (330, 795, 700, 845),
    "subtitulo":         (330, 850, 700, 875),
    "anillo_sello":      (95, 480, 160, 545),
    "cielo_turquesa":    (430, 185, 600, 225),
    "atardecer_naranja": (330, 320, 700, 365),
    "rio_turquesa":      (430, 470, 560, 520),
    "palma_oliva":       (300, 200, 380, 290),
    "guarza_blanca":     (700, 540, 760, 600),
    "yacare_verde":      (330, 590, 520, 660),
    "crema_sello":       (250, 640, 300, 670),
    "card_fondo":        (20, 20, 80, 80),
}

out = {}
for name, (x0, y0, x1, y1) in regions.items():
    d = darkest(x0, y0, x1, y1)
    v = vivid(x0, y0, x1, y1)
    out[name] = {"dark": hexc(d), "vivid": hexc(v)}
    print(name, out[name])
