"""
Captura la app con Chromium headless para revisar el render.

  python scripts\shot.py <url> <salida.png> [ancho] [alto] [--full]
"""
import os, subprocess, sys, tempfile, time

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SHOTS = os.path.join(ROOT, ".impeccable", "review")
os.makedirs(SHOTS, exist_ok=True)


def capture(url, out, width=1440, height=900, full=False, wait=3500, dpr=1):
    out = out if os.path.isabs(out) else os.path.join(SHOTS, out)
    profile = tempfile.mkdtemp(prefix="ecoguide-shot-")
    args = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--force-device-scale-factor=%s" % dpr,
        "--virtual-time-budget=%d" % (wait * 2),
        "--user-data-dir=" + profile,
        # Chrome headless impone un ancho minimo: se compensa con el factor.
        "--window-size=%d,%d" % (width * dpr, height * dpr),
        "--screenshot=" + out,
    ]
    if full:
        args.append("--screenshot-full-page")
    args.append(url)
    res = subprocess.run(args, capture_output=True, text=True, timeout=180)
    if not os.path.exists(out):
        print(res.stderr[-1500:])
        raise SystemExit("no se genero la captura")
    if dpr > 1:
        from PIL import Image

        img = Image.open(out)
        img = img.resize((img.width // dpr, img.height // dpr), Image.LANCZOS)
        img.save(out)
    print("captura:", out, os.path.getsize(out), "bytes")
    return out


if __name__ == "__main__":
    url = sys.argv[1]
    out = sys.argv[2]
    w = int(sys.argv[3]) if len(sys.argv) > 3 else 1440
    h = int(sys.argv[4]) if len(sys.argv) > 4 else 900
    full = "--full" in sys.argv
    dpr = 2 if "--mobile" in sys.argv else 1
    capture(url, out, w, h, full, dpr=dpr)
