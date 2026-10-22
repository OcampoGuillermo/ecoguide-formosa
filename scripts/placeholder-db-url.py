"""Deja .env.example con marcadores de posicion (sin credenciales reales)."""
import io
import re

PLACEHOLDER = "postgresql://USUARIO:PASSWORD@HOST/neon-db?sslmode=require"

with io.open(".env.example", encoding="utf-8") as fh:
    text = fh.read()
text = re.sub(r'DATABASE_URL="[^"]+"', 'DATABASE_URL="%s"' % PLACEHOLDER, text)
with io.open(".env.example", "w", encoding="utf-8") as fh:
    fh.write(text)

for line in text.splitlines():
    if "DATABASE_URL" in line:
        print(line)
