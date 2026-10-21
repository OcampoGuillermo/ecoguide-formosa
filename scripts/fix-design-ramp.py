"""Actualiza el bloque typography del frontmatter de DESIGN.md con la rampa real."""
import io
import re

path = "DESIGN.md"
src = io.open(path, encoding="utf-8").read()

NEW = '''typography:
  display:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 7.5rem)"
    fontWeight: 800
    fontVariation: "'wdth' 62"
    lineHeight: 0.88
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 3.5rem)"
    fontWeight: 800
    fontVariation: "'wdth' 100"
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  display-medio:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    fontVariation: "'wdth' 62"
    lineHeight: 1
  title:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    fontVariation: "'wdth' 62"
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  entradilla:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  cuerpo-chico:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.16em"
  dato:
    fontFamily: "Azeret Mono Variable, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 450
    fontFeature: "'tnum' 1"
    letterSpacing: "-0.01em"
  dato-medio:
    fontFamily: "Azeret Mono Variable, ui-monospace, monospace"
    fontSize: "0.9375rem"
    fontWeight: 450
    fontFeature: "'tnum' 1"
  dato-mini:
    fontFamily: "Azeret Mono Variable, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 450
    fontFeature: "'tnum' 1"
'''

start = src.index("typography:\n")
end = src.index("rounded:\n")
src = src[:start] + NEW + src[end:]
io.open(path, "w", encoding="utf-8").write(src)
print("frontmatter actualizado")
