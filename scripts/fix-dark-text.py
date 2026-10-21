import io, glob, re

# El texto que vive sobre el papel o sobre una plancha usa el color de campo,
# para que en el modo oscuro (papel -> tinta) siga siendo legible.
pat = "text-[var(--color-ink)]"
changed = []
for path in glob.glob("src/**/*.tsx", recursive=True):
    s = io.open(path, encoding="utf-8").read()
    if pat not in s:
        continue
    io.open(path, "w", encoding="utf-8").write(s.replace(pat, "text-[var(--field)]"))
    changed.append(path)
print("archivos actualizados:", len(changed))
for c in changed:
    print("  ", c)
