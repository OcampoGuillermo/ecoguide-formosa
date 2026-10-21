import json
import sys
import urllib.error
import urllib.request

BASE = "http://localhost:3001"
ROUTES = [
    "/",
    "/mapa",
    "/rutas",
    "/rutas/ruta-del-yacare",
    "/puntos/parque-nacional-el-colorado",
    "/puntos/reserva-natural-la-plancha",
    "/guias",
    "/escanear",
    "/ingresar",
    "/registrarse",
    "/sobre",
    "/accesibilidad",
    "/privacidad",
    "/offline",
    "/mis-rutas",
    "/mis-capsulas",
    "/admin",
    "/admin/puntos",
    "/admin/rutas",
    "/admin/moderacion",
    "/admin/usuarios",
    "/admin/analiticas",
    "/api/puntos/resolve?q=ECOF-003",
    "/api/puntos/resolve?q=NOEXISTE",
]


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


opener = urllib.request.build_opener(NoRedirect)
bad = 0
for route in ROUTES:
    req = urllib.request.Request(BASE + route, headers={"User-Agent": "ecoguide-check"})
    try:
        with opener.open(req, timeout=60) as res:
            code = res.status
            body = res.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        code = e.code
        body = e.read().decode("utf-8", "replace")
    except Exception as e:  # noqa: BLE001
        code = 0
        body = str(e)

    flag = ""
    if code == 307:
        # Redireccion a /ingresar de las rutas protegidas: es lo esperado.
        flag = "  (protegida)"
    elif code == 404 and route.startswith("/api/puntos/resolve"):
        flag = "  (codigo inexistente: correcto)"
    elif code >= 400:
        flag = "  <-- FALLA"
        bad += 1
    if "Application error" in body or "__next_error__" in body:
        flag += "  [error de render]"
        bad += 1
    print(f"{route:<44} {code}{flag}")

print("\nrutas con problema:", bad)
sys.exit(1 if bad else 0)
