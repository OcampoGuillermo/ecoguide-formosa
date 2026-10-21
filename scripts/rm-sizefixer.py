import io, re
p = "src/components/map/map-canvas.tsx"
s = io.open(p, encoding="utf-8").read()
# SizeFixer ya no se usa: se elimina la funcion.
s = re.sub(r"function SizeFixer\(\) \{.*?\n\}\n\n", "", s, flags=re.S)
io.open(p, "w", encoding="utf-8").write(s)
print("SizeFixer presente:", "function SizeFixer" in s)
