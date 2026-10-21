import io
p = "prisma/seed.ts"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    """              isVerified: guide.isVerified,
              verifiedAt: guide.isVerified ? new Date() : null,""",
    """              isVerified: false,
              isDemo: true,
              verifiedAt: null,""",
)
s = s.replace(
    """            isVerified: guide.isVerified,
            verifiedAt: guide.isVerified ? new Date() : null,""",
    """            isVerified: false,
            isDemo: true,
            verifiedAt: null,""",
)
io.open(p, "w", encoding="utf-8").write(s)
print("isDemo en el seed:", s.count("isDemo: true"), "| isVerified false:", s.count("isVerified: false"))
