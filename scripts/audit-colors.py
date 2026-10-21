import io, glob, re, collections

pat = re.compile(r"(bg|text|border|from|to|via)-\[var\(--color-[a-z0-9-]+\)\]")
hits = collections.Counter()
rows = []
for path in glob.glob("src/**/*.tsx", recursive=True) + glob.glob("src/**/*.css", recursive=True):
    s = io.open(path, encoding="utf-8").read()
    for i, line in enumerate(s.split("\n"), 1):
        for m in pat.finditer(line):
            tok = m.group(0)
            hits[tok] += 1
            if tok in ("bg-[var(--color-paper-3)]", "text-[var(--color-ink-3)]",
                       "text-[var(--color-turq-2)]", "bg-[var(--color-paper-2)]",
                       "text-[var(--color-ink-2)]", "bg-[var(--color-chalk)]",
                       "text-[var(--color-paper-2)]"):
                rows.append((path.split("ecoguide-formosa")[-1], i, tok))
for k, v in sorted(hits.items()):
    print("%-34s %d" % (k, v))
print("\n--- sensibles ---")
for r in rows:
    print("  %-46s %4d  %s" % r)
