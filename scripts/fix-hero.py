"""Recompone el hero de la landing: titular a dos lineas, sin bloque de
metricas, y la banda del mapa a sangre entrando en la primera pantalla.
"""
import io

path = "src/app/page.tsx"
src = io.open(path, encoding="utf-8").read()

OLD_HERO_START = '      {/* ---------------------------------------------------------- Portada */}'
OLD_HERO_END = '      {/* ----------------------------------------------------- El mapa real */}'

start = src.index(OLD_HERO_START)
end = src.index(OLD_HERO_END)

NEW_HERO = '''      {/* ---------------------------------------------------------- Portada */}
      <section className="relative overflow-hidden border-b-2 border-[var(--color-ink)]">
        <div className="h-1.5 w-full bg-[var(--color-ink)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-12 pb-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pt-16 lg:pb-14">
          <div className="lg:col-span-8">
            <h1 className="display text-[clamp(2.75rem,7vw,6rem)] text-[var(--color-ink)]">
              <span className="ink-print block">Turismo Regional</span>
              <span
                className="ink-mis ink-print block text-[var(--color-rust)]"
                data-text="&amp; Naturaleza"
                style={{ animationDelay: "120ms" }}
              >
                &amp; Naturaleza
              </span>
            </h1>

            <div className="rule-strong mt-7 max-w-md" />

            <p className="measure-wide mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-[var(--field-soft)]">
              Formosa, provincia del Chaco: doce reservas y parques con sus
              rutas, sus aves y la voz de quien las recorre. El mapa, las
              audioguías y los clips se descargan y funcionan{" "}
              <strong className="font-semibold text-[var(--color-ink)]">
                sin señal
              </strong>
              , en el lugar y en el sendero.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/mapa" className="btn btn-primary">
                Explorar el mapa
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/escanear" className="btn btn-ghost">
                <QrCode className="size-4" aria-hidden="true" />
                Escanear señalética
              </Link>
            </div>

            <p className="measure mt-7 border-t border-[var(--rule)] pt-4 text-[0.78rem] text-[var(--field-soft)]">
              {stats.points} puntos publicados · {stats.routes} rutas ·{" "}
              {stats.audio} audioguías · {stats.guides} guías
            </p>
          </div>

          {/* La viñeta: el sello real del proyecto */}
          <div className="lg:col-span-4">
            <div className="relative mx-auto max-w-xs lg:max-w-sm">
              <div className="plate-turq screen relative aspect-square overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-[var(--color-ink)]" />
                <div className="absolute -right-6 top-10 h-20 w-20 bg-[var(--color-rust)]" />
                <div className="absolute bottom-14 -left-5 h-14 w-24 bg-[var(--color-olive)]" />
                <div className="absolute inset-0 grid place-items-center p-8">
                  <Image
                    src="/brand/sello.png"
                    alt="Sello de EcoGuide Formosa: un yacaré, una garza y el río Bermejo entre palmeras, con la brújula arriba"
                    width={560}
                    height={560}
                    className="stamp-press w-full max-w-[80%]"
                    priority
                  />
                </div>
              </div>
              <p className="measure mt-3 text-[0.68rem] text-[var(--field-soft)]">
                Sello del proyecto · yacaré, garza y el Bermejo
              </p>
            </div>
          </div>
        </div>
      </section>

'''

src = src[:start] + NEW_HERO + src[end:]

# La banda del mapa: encabezado compacto y mapa a sangre.
OLD_BAND_START = '      {/* ----------------------------------------------------- El mapa real */}'
OLD_BAND_END = '      {/* --------------------------------------------------------- Módulos */}'
b0 = src.index(OLD_BAND_START)
b1 = src.index(OLD_BAND_END)

NEW_BAND = '''      {/* ----------------------------------------------------- El mapa real */}
      <section className="border-b-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 pt-10 pb-6 sm:px-6 lg:px-8 lg:pt-12">
          <h2 className="display-wide max-w-2xl text-[clamp(1.6rem,3.2vw,2.5rem)]">
            Doce lugares de la provincia, en el mapa de verdad
          </h2>
          <Link
            href="/mapa"
            className="label inline-flex items-center gap-2 border-b-2 border-[var(--color-sunset)] pb-1 transition-colors duration-150 hover:text-[var(--color-sunset)]"
          >
            Abrir el mapa completo
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-8 lg:bleed-left">
            <div className="h-[22rem] border-y border-[var(--color-paper)]/25 sm:h-[26rem] lg:h-[30rem] lg:border-y-0 lg:border-r">
              <MapShell points={points} />
            </div>
          </div>

          <div className="lg:col-span-4 lg:bleed-right px-4 pt-8 pb-10 sm:px-6 lg:pt-0">
            <ul className="max-h-[30rem] divide-y divide-[var(--color-paper)]/15 overflow-y-auto border-y border-[var(--color-paper)]/20">
              {points.slice(0, 8).map((point) => (
                <li key={point.id}>
                  <Link
                    href={`/puntos/${point.slug}`}
                    className="group flex items-start gap-3 py-3 transition-colors duration-150 hover:wash-paper"
                  >
                    <span
                      className="mt-1.5 size-2.5 shrink-0"
                      style={{ backgroundColor: CATEGORY_COLOR[point.category] }}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[0.95rem] font-semibold">
                        {point.name}
                      </span>
                      <span className="measure block text-[0.68rem] text-[var(--color-paper)]/55">
                        {point.region} · {CATEGORY_LABEL[point.category]}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.82rem] leading-relaxed text-[var(--color-paper)]/60">
              Cada punto lleva su ficha, sus audioguías en tres idiomas y su clip
              vertical. Los tiles quedan cacheados para cuando no hay cobertura.
            </p>
          </div>
        </div>
      </section>

'''

src = src[:b0] + NEW_BAND + src[b1:]

io.open(path, "w", encoding="utf-8").write(src)
print("hero y banda del mapa recompuestos")
print("queda el bloque de metricas:", "Puntos publicados" in src)
