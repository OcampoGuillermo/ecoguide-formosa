"""Genera los activos de marca de EcoGuide Formosa a partir del logo maestro.

Salidas:
  public/brand/logo.png            maestro intacto
  public/icons/icon-<n>.png        iconos PWA (sello recortado)
  public/icons/icon-maskable-512.png  icono con zona de seguridad
  public/favicon.ico / favicon-32.png
  public/apple-touch-icon.png
  public/og-image.jpg              1200x630
"""
import os, json, colorsys
from collections import Counter
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SRC = r"C:\Users\guill\Downloads\ecoguide-formosa-corregido\ecoguide-formosa\public\assets\logo.png"
BRAND = os.path.join(ROOT, "public", "brand")
ICONS = os.path.join(ROOT, "public", "icons")
os.makedirs(BRAND, exist_ok=True)
os.makedirs(ICONS, exist_ok=True)

im = Image.open(SRC).convert("RGB")
W, H = im.size
px = im.load()
print("logo maestro:", W, "x", H)

# ---------------------------------------------------------------- paleta
def hexc(c):
    return "#%02X%02X%02X" % c

def sample(x0, y0, x1, y1, mode="dark"):
    """mode='dark' -> pixel mas oscuro del area (la tinta). mode='sat' -> mas saturado."""
    best, key = None, None
    for y in range(max(0, y0), min(H, y1)):
        for x in range(max(0, x0), min(W, x1)):
            r, g, b = px[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if mode == "dark":
                k = -v
            else:
                if v < 0.35:
                    continue
                k = s
            if key is None or k > key:
                key, best = k, (r, g, b)
    return hexc(best) if best else None

def dominant(x0, y0, x1, y1, bins=24):
    cnt = Counter()
    for y in range(max(0, y0), min(H, y1)):
        for x in range(max(0, x0), min(W, x1)):
            r, g, b = px[x, y]
            cnt[(r // 12 * 12, g // 12 * 12, b // 12 * 12)] += 1
    (r, g, b), _ = cnt.most_common(1)[0]
    return hexc((r, g, b))

def modal_ink(x0, y0, x1, y1, max_v=0.62):
    """Color modal (cuantizado) de los pixeles oscuros del area: el color de la tinta."""
    cnt = Counter()
    for y in range(max(0, y0), min(H, y1)):
        for x in range(max(0, x0), min(W, x1)):
            r, g, b = px[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if v <= max_v:
                cnt[(r // 6 * 6, g // 6 * 6, b // 6 * 6)] += 1
    (r, g, b), _ = cnt.most_common(1)[0]
    return hexc((r, g, b))

def modal_sat(x0, y0, x1, y1, lo=0.18):
    """Color modal entre los pixeles saturados del area."""
    cnt = Counter()
    for y in range(max(0, y0), min(H, y1)):
        for x in range(max(0, x0), min(W, x1)):
            r, g, b = px[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if s >= lo and 0.3 <= v <= 0.98:
                cnt[(r // 8 * 8, g // 8 * 8, b // 8 * 8)] += 1
    if not cnt:
        return None
    (r, g, b), _ = cnt.most_common(1)[0]
    return hexc((r, g, b))

PALETTE = {
    # Paleta extraida del logo maestro (public/brand/logo.png)
    "ink":        "#0F3246",   # wordmark EcoGuide / tinta petroleo
    "petrol":     "#19323C",   # anillo exterior del sello
    "terracotta": "#A8501C",   # FORMOSA
    "sand":       "#EADEC0",   # papel del sello
    "sand_deep":  "#D6C396",
    "card":       "#F6F6F6",
    "turquoise":  "#3FB5B8",   # rio y cielo
    "olive":      "#5A6B3C",   # palmeras y yacare
    "orange":     "#F8A652",   # atardecer
}
print("paleta:", json.dumps(PALETTE, indent=1))
with open(os.path.join(BRAND, "palette.json"), "w", encoding="utf-8") as f:
    json.dump(PALETTE, f, indent=2)

# ---------------------------------------------------------------- sello
# crema del sello contra la tarjeta blanca
xs, ys = [], []
for y in range(0, H, 2):
    for x in range(0, W, 2):
        r, g, b = px[x, y]
        if r > 225 and g > 210 and b < 225 and (r - b) > 18:
            xs.append(x); ys.append(y)
bx0, by0, bx1, by1 = min(xs), min(ys), max(xs), max(ys)
side = max(bx1 - bx0, by1 - by0)
cx, cy = (bx0 + bx1) // 2, (by0 + by1) // 2
r = side // 2
print("sello bbox:", (bx0, by0, bx1, by1), "centro", cx, cy, "r", r)

badge = im.crop((cx - r, cy - r, cx + r, cy + r)).resize((1024, 1024), Image.LANCZOS)
badge.save(os.path.join(BRAND, "badge.png"))

# tarjeta completa (el logo con su fondo), util para OG
im.save(os.path.join(BRAND, "logo.png"))

# ---------------------------------------------------------------- iconos
def on_canvas(badge_img, canvas, ratio, bg):
    out = Image.new("RGB", (canvas, canvas), bg)
    size = int(canvas * ratio)
    b = badge_img.resize((size, size), Image.LANCZOS)
    out.paste(b, ((canvas - size) // 2, (canvas - size) // 2))
    return out

SAND = PALETTE["sand"]
INK = PALETTE["ink"]

for n in (72, 96, 128, 144, 152, 180, 192, 384, 512):
    icon = on_canvas(badge, n, 1.0, "#FFFFFF")
    icon.save(os.path.join(ICONS, "icon-%dx%d.png" % (n, n)), optimize=True)

mask = on_canvas(badge, 512, 0.72, INK)
mask.save(os.path.join(ICONS, "icon-maskable-512.png"), optimize=True)

# favicon
on_canvas(badge, 32, 1.0, "#FFFFFF").save(os.path.join(ROOT, "public", "favicon-32.png"), optimize=True)
on_canvas(badge, 16, 1.0, "#FFFFFF").save(os.path.join(ROOT, "public", "favicon-16x16.png"), optimize=True)
on_canvas(badge, 180, 1.0, "#FFFFFF").save(os.path.join(ROOT, "public", "apple-touch-icon.png"), optimize=True)
on_canvas(badge, 32, 1.0, "#FFFFFF").save(os.path.join(ROOT, "public", "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32)])

# ---------------------------------------------------------------- og-image
og = Image.new("RGB", (1200, 630), SAND)
d = ImageDraw.Draw(og)
b = badge.resize((560, 560), Image.LANCZOS)
og.paste(b, (620, 35))
d.rectangle((0, 0, 1200, 14), fill=INK)
d.text((70, 96), "EcoGuide", fill=INK)
d.text((70, 176), "FORMOSA", fill=PALETTE["terracotta"])
d.line((70, 268, 560, 268), fill=INK, width=3)
d.text((70, 296), "TURISMO REGIONAL & NATURALEZA", fill=INK)
d.text((70, 340), "Geolocalizacion, audioguias de guias locales,", fill=INK)
d.text((70, 372), "escaner QR y rutas ecoturisticas. Sin conexion.", fill=INK)
d.rectangle((70, 452, 330, 522), fill=PALETTE["terracotta"])
d.text((96, 474), "Explorar el mapa", fill="#FFFFFF")
d.text((70, 566), "Provincia de Formosa - Republica Argentina", fill=INK)
og.save(os.path.join(ROOT, "public", "og-image.png"), optimize=True)

print("activos listos")
for root, _, files in os.walk(os.path.join(ROOT, "public")):
    for f in sorted(files):
        p = os.path.join(root, f)
        print("  %8d  %s" % (os.path.getsize(p), os.path.relpath(p, ROOT)))
