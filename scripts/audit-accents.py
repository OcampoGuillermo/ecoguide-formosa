import io, glob, re
pat = re.compile(r"(text|bg)-\[var\(--color-(olive|sunset|turq|turq-2)\)\]")
for path in glob.glob("src/**/*.tsx", recursive=True):
    s = io.open(path, encoding="utf-8").read()
    for i, line in enumerate(s.split("\n"), 1):
        if pat.search(line):
            print("%-44s %4d  %s" % (path.split("ecoguide-formosa")[-1], i, line.strip()[:105]))
