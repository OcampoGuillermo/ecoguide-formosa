"""Fija la paleta de marca por dominante de tono dentro de cada region del logo."""
import os, json, colorsys
from PIL import Image

SRC = r"C:\Users\guill\Downloads\ecoguide-formosa-corregido\ecoguide-formosa\public\assets\logo.png"
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
im = Image.open(SRC).convert("RGB")
px = im.load()
W, H = im.size

def hexc(c):
    return "#%02X%02X%02X" % c

def dominant_hue(x0, y0, x1, y1, min_s=0.20, min_v=0.25):
    """Tono dominante entre los pixeles saturados de la region, y su color medio."""
    hist = [0] * 36
    picks = []
    for y in range(max(0, y0), min(H, y1)):
        for x in range(max(0, x0), min(W, x1)):
            r, g, b = px[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if s < min_s or v < min_v:
                continue
            bin_ = int(h * 36) % 36
            hist[bin_] += 1
            picks.append((bin_, (r, g, b)))
    if not picks:
        return None, None
    top = max(range(36), key=lambda i: hist[i])
    group = [c for bn, c in picks if bn == top or (top == 0 and bn in (35, 0, 1))]
    r = sum(c[0] for c in group) // len(group)
    g = sum(c[1] for c in group) // len(group)
    b = sum(c[2] for c in group) // len(group)
    return hexc((r, g, b)), top * 10

def darkest(x0, y0, x1, y1, max_v=0.55):
    from collections import Counter
    cnt = Counter()
    for y in range(max(0, y0), min(H, y1)):
        for x in range(max(0, x0), min(W, x1)):
            r, g, b = px[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if v <= max_v:
                cnt[(r // 5 * 5, g // 5 * 5, b // 5 * 5)] += 1
    (r, g, b), _ = cnt.most_common(1)[0]
    return hexc((r, g, b))

def lightest(x0, y0, x1, y1, min_v=0.80):
    from collections import Counter
    cnt = Counter()
    for y in range(max(0, y0), min(H, y1)):
        for x in range(max(0, x0), min(W, x1)):
            r, g, b = px[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if v >= min_v:
                cnt[(r // 6 * 6, g // 6 * 6, b // 6 * 6)] += 1
    if not cnt:
        return None
    (r, g, b), _ = cnt.most_common(1)[0]
    return hexc((r, g, b))

P = {}
P["ink"] = darkest(255, 690, 765, 770)            # EcoGuide
P["petrol"] = darkest(150, 300, 195, 380)          # arco del sello
P["terracotta"], _ = dominant_hue(320, 790, 700, 838, min_s=0.30)   # FORMOSA
P["sand"] = lightest(340, 898, 660, 936)           # crema del sello
P["card"] = lightest(15, 15, 80, 80)
P["sky"], _ = dominant_hue(600, 215, 700, 250, min_s=0.12)          # turquesa alto
P["sunset"], _ = dominant_hue(650, 270, 780, 330, min_s=0.25)       # naranja atardecer
P["river"], _ = dominant_hue(480, 455, 570, 505, min_s=0.15)        # turquesa del rio
P["palm"], _ = dominant_hue(250, 195, 320, 260, min_s=0.20)         # verde palmera
P["olive"], _ = dominant_hue(300, 560, 470, 640, min_s=0.15)        # verde yacare
P["tan"], _ = dominant_hue(600, 415, 660, 445, min_s=0.15)          # madera del puente
P["croc_skin"], _ = dominant_hue(430, 570, 540, 620, min_s=0.15)

print(json.dumps(P, indent=1))
with open(os.path.join(ROOT, ".impeccable", "palette-raw.json"), "w", encoding="utf-8") as f:
    json.dump(P, f, indent=2)
