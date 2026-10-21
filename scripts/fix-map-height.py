import io, glob, re
# El mapa siempre necesita una altura explicita: se pasa por className.
for path, old, new in [
    ("src/app/page.tsx",
     '<MapShell points={points} />',
     '<MapShell points={points} className="h-full" />'),
    ("src/app/mapa/page.tsx", None, None),
]:
    s = io.open(path, encoding="utf-8").read()
    if old and old in s:
        s = s.replace(old, new)
        io.open(path, "w", encoding="utf-8").write(s)
        print("actualizado", path)

# mapa: la altura la fija el contenedor, el shell la hereda
p = "src/components/map/map-explorer.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    '<div className="h-[26rem] overflow-hidden border-2 border-[var(--color-ink)] sm:h-[34rem]">\n              <MapShell points={filtered} activeSlug={activeSlug} onSelect={setActiveSlug} />\n            </div>',
    '<div className="h-[26rem] overflow-hidden border-2 border-[var(--color-ink)] sm:h-[34rem]">\n              <MapShell\n                points={filtered}\n                activeSlug={activeSlug}\n                onSelect={setActiveSlug}\n                className="h-full"\n              />\n            </div>',
)
io.open(p, "w", encoding="utf-8").write(s)
print("mapa explorer ok:", 'className="h-full"' in s)

# ruta: idem
p = "src/app/rutas/[slug]/page.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace('<MapShell points={points} />', '<MapShell points={points} className="h-full" />')
io.open(p, "w", encoding="utf-8").write(s)
print("ruta ok:", 'className="h-full"' in s)

# landing: el contenedor del mapa tiene la altura
p = "src/app/page.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    '<MapShell points={points} className="h-full" />',
    '<MapShell points={points} className="h-full" />',
)
io.open(p, "w", encoding="utf-8").write(s)
