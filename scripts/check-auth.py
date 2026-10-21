"""Inicia sesión con la cuenta de administración y recorre las rutas protegidas.

  python scripts/check-auth.py
"""
import http.cookiejar
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = "http://localhost:3001"
jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


plain = urllib.request.build_opener(NoRedirect)


def get(path, follow=False):
    opener_or = opener if follow else plain
    req = urllib.request.Request(BASE + path, headers={"User-Agent": "ecoguide-auth"})
    try:
        with opener_or.open(req, timeout=60) as res:
            return res.status, res.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")


def post(path, data):
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(
        BASE + path,
        data=body,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "ecoguide-auth",
        },
    )
    try:
        # Se usa el opener con cookies para que la redireccion 302 se siga y
        # el session token quede guardado.
        with opener.open(req, timeout=60) as res:
            return res.status, res.read().decode("utf-8", "replace"), res.headers
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace"), e.headers


status, html = get("/api/auth/csrf")
m = re.search(r'"csrfToken":"([^"]+)"', html)
if not m:
    print("no se pudo obtener el csrf:", status, html[:300])
    sys.exit(1)
csrf = m.group(1)

status, body, headers = post(
    "/api/auth/callback/credentials",
    {
        "csrfToken": csrf,
        "email": "admin@ecoguide.formosa",
        "password": "ecoguide-admin-2026",
        "redirect": "false",
        "json": "true",
    },
)
print("login status:", status)

cookies = [c.name for c in jar]
print("cookies:", cookies)
if "authjs.session-token" not in cookies and "next-auth.session-token" not in cookies:
    print("no se creo la sesion:", body[:400])
    sys.exit(1)

PROTECTED = [
    "/mis-rutas",
    "/mis-capsulas",
    "/admin",
    "/admin/puntos",
    "/admin/rutas",
    "/admin/moderacion",
    "/admin/usuarios",
    "/admin/analiticas",
]

bad = 0
for route in PROTECTED:
    code, body = get(route, follow=True)
    ok = code == 200 and "Application error" not in body
    print(f"{route:<26} {code}  {'OK' if ok else 'FALLA'}")
    if not ok:
        bad += 1

print("\nfallas:", bad)
sys.exit(1 if bad else 0)
