"""Alinea los colores fijos que no rotan con el tema oscuro."""
import io

FIXES = [
    # La banda de audioguias de la portada: el fondo tiene que rotar con el tema.
    ("src/app/page.tsx",
     'className="border-y-2 border-[var(--color-ink)] bg-[var(--color-paper-3)]"',
     'className="border-y-2 border-[var(--color-ink)] bg-[var(--surface)]"'),
    # Hover de las filas de modulos: la superficie tiene que ser el lavado tematizado.
    ("src/app/page.tsx",
     'hover:bg-[var(--color-paper-3)]',
     'hover:wash'),
    # Los sellos de idioma de la landing.
    ("src/app/page.tsx",
     'className="stamp text-[var(--color-ink-3)]"',
     'className="stamp text-[var(--field-soft)]"'),
    # Tarjetas del panel.
    ("src/app/admin/page.tsx",
     'hover:bg-[var(--color-paper-3)]',
     'hover:wash'),
    # Chips de especialidades.
    ("src/app/guias/page.tsx",
     'className="stamp text-[var(--color-ink-3)]"',
     'className="stamp text-[var(--field-soft)]"'),
    ("src/app/puntos/[slug]/page.tsx",
     'className="stamp text-[var(--color-ink-3)]"',
     'className="stamp text-[var(--field-soft)]"'),
    # Sello de verificado: token tematizado.
    ("src/app/guias/page.tsx",
     'text-[var(--color-turq-2)] uppercase',
     'text-[var(--acento-verificado)] uppercase'),
    ("src/components/admin/users-client.tsx",
     'text-[var(--color-turq-2)] uppercase',
     'text-[var(--acento-verificado)] uppercase'),
    # Oliva como texto: token tematizado.
    ("src/app/mis-rutas/page.tsx",
     'text-[var(--color-olive)]',
     'text-[var(--acento-vivo)]'),
    ("src/components/route-progress.tsx",
     '"border-[var(--color-olive)] text-[var(--color-olive)]"',
     '"border-[var(--acento-vivo)] text-[var(--acento-vivo)]"'),
    # Marcador de carga del mapa.
    ("src/components/map/map-shell.tsx",
     'bg-[var(--color-paper-2)]',
     'bg-[var(--surface)]'),
    ("src/components/map/map-shell.tsx",
     'text-[var(--color-ink-3)]',
     'text-[var(--field-soft)]'),
]

for path, old, new in FIXES:
    src = io.open(path, encoding="utf-8").read()
    if old not in src:
        print("  (no encontrado) %s :: %s" % (path, old[:60]))
        continue
    io.open(path, "w", encoding="utf-8").write(src.replace(old, new))
    print("  ok %s :: %s" % (path, old[:58]))
