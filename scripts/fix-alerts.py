import io, re, glob

old = 'className="mt-5 border-l-2 border-[var(--color-rust)] bg-[var(--color-rust)]/10 px-3 py-2 text-[0.9rem] text-[var(--color-ink)]"'
old2 = 'className="mt-5 border-l-2 border-[var(--color-rust)] bg-[var(--color-rust)]/10 px-3 py-2 text-[0.9rem]"'

changed = []
for path in glob.glob("src/**/*.tsx", recursive=True):
    src = io.open(path, encoding="utf-8").read()
    if old not in src and old2 not in src:
        continue
    src = src.replace(old, 'className="alert"').replace(old2, 'className="alert"')
    io.open(path, "w", encoding="utf-8").write(src)
    changed.append(path)

print("actualizados:", changed)

# Quedan restos de border-l o backdrop-blur?
restos = []
for path in glob.glob("src/**/*.tsx", recursive=True) + glob.glob("src/**/*.css", recursive=True):
    src = io.open(path, encoding="utf-8").read()
    for pat in ["border-l-2", "backdrop-blur", "shadow-[4px_4px_0", "box-shadow: 4px"]:
        if pat in src:
            restos.append((path, pat))
print("restos:", restos)
