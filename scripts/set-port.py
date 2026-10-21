import sys

path = sys.argv[1] if len(sys.argv) > 1 else ".env"
with open(path, encoding="utf-8") as fh:
    text = fh.read()

text = text.replace("NEXTAUTH_URL=\"http://localhost:3000\"", "NEXTAUTH_URL=\"http://localhost:3001\"")
text = text.replace("NEXT_PUBLIC_APP_URL=\"http://localhost:3000\"", "NEXT_PUBLIC_APP_URL=\"http://localhost:3001\"")

with open(path, "w", encoding="utf-8") as fh:
    fh.write(text)

print([line for line in text.splitlines() if "URL" in line])
