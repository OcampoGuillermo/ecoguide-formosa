"""
Genera los clips verticales de cada punto: cartel en movimiento, no foto falsa.

Una lamina tipografica de 720x1280 con la ilustracion plana del mundo (rio,
palmeras, sol, aves) y una animacion de "tirada de tinta" que se imprime en
cuadros. Se codifica a MP4 vertical con ffmpeg.
"""
import os, math, json, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
FONTS = os.path.join(ROOT, "src", "fonts")
OUT = os.path.join(ROOT, "public", "media", "video")
TMP = os.path.join(ROOT, ".impeccable", "frames")
os.makedirs(OUT, exist_ok=True)
os.makedirs(TMP, exist_ok=True)

W, H = 720, 1280
FPS = 24
SECONDS = 5

INK = (15, 50, 70)
RUST = (168, 80, 28)
TURQ = (63, 181, 184)
OLIVE = (90, 107, 60)
SAND = (234, 222, 192)
SAND_DEEP = (214, 195, 150)
SUNSET = (248, 166, 82)
PAPER_TEX = os.path.join(ROOT, "public", "textures", "paper.png")

archivo = ImageFont.truetype(os.path.join(FONTS, "Archivo-Variable.ttf"), 96)
azeret = ImageFont.truetype(os.path.join(FONTS, "AzeretMono-Variable.ttf"), 22)

def set_var(font, wdth, wght):
    try:
        font.set_variation_by_axes([wdth, wght])
    except Exception:
        pass

def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines

def flat_scene(d, y0, h):
    """La ilustracion plana: sol, cielo, rio, palmeras, aves. Todo del mundo."""
    sky_top = y0
    horizon = y0 + int(h * 0.46)
    # cielo en dos tintas
    d.rectangle([0, sky_top, W, horizon], fill=(120, 198, 201))
    d.rectangle([0, sky_top + int(h * 0.22), W, horizon], fill=(160, 214, 212))
    # sol
    d.ellipse([W * 0.34, horizon - int(h * 0.30), W * 0.66, horizon + int(h * 0.02)], fill=SUNSET)
    # campo
    d.rectangle([0, horizon, W, y0 + h], fill=SAND_DEEP)
    # rio en zigzag
    d.polygon(
        [(W * 0.18, horizon), (W * 0.44, horizon), (W * 0.62, y0 + h), (W * 0.24, y0 + h)],
        fill=TURQ,
    )
    # palmeras: tronco y hojas planas
    for bx, scale in ((W * 0.14, 1.0), (W * 0.86, 0.85)):
        top = horizon - 120 * scale
        d.rectangle([bx - 5 * scale, top, bx + 5 * scale, horizon + 20], fill=(120, 88, 54))
        for ang in (-160, -135, -105, -80, -20, 5, 30):
            rad = math.radians(ang)
            length = 82 * scale
            ex = bx + math.cos(rad) * length
            ey = top + math.sin(rad) * length * 0.72
            mid = ((bx + ex) / 2, (top + ey) / 2)
            d.line([bx, top, mid[0], mid[1]], fill=OLIVE, width=int(7 * scale))
            d.ellipse(
                [ex - 17 * scale, ey - 11 * scale, ex + 17 * scale, ey + 11 * scale],
                fill=OLIVE,
            )
        d.ellipse([bx - 11 * scale, top - 11 * scale, bx + 11 * scale, top + 11 * scale], fill=(74, 90, 46))
    # aves: dos galones
    for ax, ay, s in ((W * 0.62, sky_top + 40, 1.0), (W * 0.72, sky_top + 82, 0.7)):
        d.line([ax - 16 * s, ay, ax, ay - 10 * s], fill=INK, width=int(4 * s))
        d.line([ax, ay - 10 * s, ax + 16 * s, ay], fill=INK, width=int(4 * s))

def base_frame(point):
    img = Image.new("RGB", (W, H), SAND)
    try:
        tex = Image.open(PAPER_TEX).convert("RGB").resize((W, H))
        img = Image.blend(img, tex, 0.45)
    except Exception:
        pass
    d = ImageDraw.Draw(img)

    d.rectangle([0, 0, W, 14], fill=INK)
    d.rectangle([0, 14, W, 20], fill=RUST)

    # titulo condensado: el tamano se ajusta para que el nombre entre entero
    name = point["name"].upper()
    size = 96 if len(name) <= 16 else (74 if len(name) <= 26 else 58)
    title_font = ImageFont.truetype(os.path.join(FONTS, "Archivo-Variable.ttf"), size)
    set_var(title_font, 62, 800)
    y = 78
    for line in wrap(d, name, title_font, W - 96):
        d.text((48, y), line, font=title_font, fill=INK)
        y += int(size * 0.92)

    # filete
    d.rectangle([48, y + 14, W - 48, y + 18], fill=INK)

    # escena
    scene_top = y + 54
    scene_h = H - scene_top - 210
    flat_scene(d, scene_top, scene_h)

    # pie de imprenta
    set_var(archivo, 100, 700)
    small = ImageFont.truetype(os.path.join(FONTS, "Archivo-Variable.ttf"), 30)
    set_var(small, 100, 700)
    d.text((48, H - 168), "ECOGUIDE FORMOSA", font=small, fill=INK)

    set_var(azeret, 400, 450)
    coords = "%s  %s" % (point["latitude"], point["longitude"])
    d.text((48, H - 112), coords, font=azeret, fill=INK)
    d.text((48, H - 76), point["region"].upper(), font=azeret, fill=(15, 50, 70))
    d.text((48, H - 42), point["qr"], font=azeret, fill=RUST)
    return img

def main():
    plan_path = os.path.join(ROOT, ".impeccable", "video-plan.json")
    points = json.load(open(plan_path, encoding="utf-8"))
    total = len(points)

    for i, p in enumerate(points, 1):
        final = base_frame(p)
        frames_dir = os.path.join(TMP, p["slug"])
        os.makedirs(frames_dir, exist_ok=True)

        n = FPS * SECONDS
        for f in range(n):
            # la tinta avanza de izquierda a derecha y luego se asienta
            t = f / n
            sweep = min(1.0, t / 0.42)
            x = int(W * sweep)
            frame = Image.new("RGB", (W, H), SAND)
            if x > 0:
                frame.paste(final.crop((0, 0, x, H)), (0, 0))
            # el borde de la plancha, terracota
            if 0 < x < W:
                d = ImageDraw.Draw(frame)
                d.rectangle([x - 5, 0, x, H], fill=RUST)
            # desregistro: en el primer imprime las tintas se corren 2 px
            if t < 0.5:
                d = ImageDraw.Draw(frame)
                d.rectangle([0, 0, W, 14], fill=(INK[0] + 18, INK[1], INK[2]))
            frame.save(os.path.join(frames_dir, "f%04d.png" % f))

        mp3 = os.path.join(OUT, p["slug"] + ".mp4")
        cmd = [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-framerate", str(FPS),
            "-i", os.path.join(frames_dir, "f%04d.png"),
            "-c:v", "libx264", "-preset", "slow", "-crf", "24",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            mp3,
        ]
        subprocess.run(cmd, check=True)
        dur = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", mp3],
            capture_output=True, text=True, check=True).stdout.strip()
        p["duration"] = int(float(dur))
        print("[%d/%d] %s (%.1fs)" % (i, total, p["slug"], float(dur)))

        for f in os.listdir(frames_dir):
            os.remove(os.path.join(frames_dir, f))
        os.rmdir(frames_dir)

    with open(plan_path, "w", encoding="utf-8") as fh:
        json.dump(points, fh, indent=2)
    print("clips listos:", total)

if __name__ == "__main__":
    main()
