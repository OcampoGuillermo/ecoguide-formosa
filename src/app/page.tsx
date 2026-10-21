import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  QrCode,
  Headphones,
  Map as MapIcon,
  Layers,
  Play,
  Users,
  Download,
  CheckCircle2,
} from "lucide-react";
import { MapShell } from "@/components/map/map-shell";
import { AudioPlayer } from "@/components/audio-player";
import { listGuides, listPoints, listRoutes, listStats } from "@/lib/queries";
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  DIFFICULTY_LABEL,
  LANGUAGE_LABEL,
} from "@/lib/constants";
import { formatDistance, formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

const MODULES = [
  {
    icon: MapIcon,
    title: "Mapa con tu ubicación real",
    desc: "Los doce puntos publicados de la provincia con coordenadas, categoría y ficha. Funciona con los tiles cacheados cuando no hay señal.",
    href: "/mapa",
    color: "var(--color-turq)",
  },
  {
    icon: Headphones,
    title: "Audioguías de guías locales",
    desc: "La voz de quien conoce el lugar, en español, guaraní e inglés. Descargadas, se escuchan sin cobertura.",
    href: "/guias",
    color: "var(--color-olive)",
  },
  {
    icon: QrCode,
    title: "Escáner de la señalética",
    desc: "Leés el código del cartel del sendero y abrís la ficha con su audioguía y su clip, sin escribir nada.",
    href: "/escanear",
    color: "var(--color-rust)",
  },
  {
    icon: Layers,
    title: "Rutas con distancia y desnivel",
    desc: "Cinco circuitos temáticos con paradas ordenadas, tiempos y dificultad. El progreso se guarda en el teléfono.",
    href: "/rutas",
    color: "var(--color-ink-3)",
  },
  {
    icon: Play,
    title: "Clips verticales",
    desc: "Microvideos de quince segundos por punto, para compartir y para el feed de las redes del programa.",
    href: "/puntos/parque-nacional-el-colorado",
    color: "var(--color-sunset)",
  },
  {
    icon: Users,
    title: "Comunidad de guías",
    desc: "Perfiles verificados, especialidades e idiomas. Cada cápsula pasa por moderación antes de publicarse.",
    href: "/guias",
    color: "var(--color-turq-2)",
  },
];

export default async function HomePage() {
  const [points, routes, guides, stats] = await Promise.all([
    listPoints(),
    listRoutes(),
    listGuides(),
    listStats(),
  ]);

  const featurePoint = points.find(
    (p) => p.slug === "parque-nacional-el-colorado",
  );
  const featuredAudio = featurePoint?.audioGuides ?? [];
  const featuredRoute = routes.find((r) => r.slug === "ruta-del-yacare");

  return (
    <>
      {/* ---------------------------------------------------------- Portada */}
      <section className="relative overflow-hidden border-b-2 border-[var(--color-ink)]">
        <div className="h-1.5 w-full bg-[var(--color-ink)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-12 pb-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pt-16 lg:pb-14">
          <div className="lg:col-span-8">
            <h1 className="display text-[clamp(2.75rem,7vw,6rem)] text-[var(--field)]">
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
              <strong className="font-semibold text-[var(--field)]">
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

      {/* ----------------------------------------------------- El mapa real */}
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
              <MapShell points={points} className="h-full" />
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

      {/* --------------------------------------------------------- Módulos */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="display-wide text-[clamp(1.9rem,4vw,3rem)] text-[var(--field)]">
              Seis módulos que funcionan en el mismo lugar
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-[var(--field-soft)]">
              Todo lo que hace la plataforma está pensado para el mismo escenario:
              de pie, al sol, con el teléfono en una mano y sin datos.
            </p>
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t-2 border-[var(--color-ink)]">
              {MODULES.map((module) => (
                <li key={module.title}>
                  <Link
                    href={module.href}
                    className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-[var(--rule)] py-6 transition-colors duration-150 hover:bg-[var(--color-paper-3)] sm:gap-6"
                  >
                    <span
                      className="mt-1 grid size-10 shrink-0 place-items-center"
                      style={{ backgroundColor: module.color }}
                      aria-hidden="true"
                    >
                      <module.icon className="size-5 text-[var(--field)]" />
                    </span>
                    <span>
                      <span className="display block text-[1.4rem] leading-tight text-[var(--field)] transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1">
                        {module.title}
                      </span>
                      <span className="mt-2 block max-w-xl leading-relaxed text-[var(--field-soft)]">
                        {module.desc}
                      </span>
                    </span>
                    <ArrowRight
                      className="mt-2 size-5 shrink-0 text-[var(--field-soft)] transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:text-[var(--color-rust)]"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Audioguías */}
      {featurePoint && featuredAudio.length > 0 && (
        <section className="border-y-2 border-[var(--color-ink)] bg-[var(--color-paper-3)]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <h2 className="display-wide text-[clamp(1.9rem,4vw,3rem)] text-[var(--field)]">
                  La voz del lugar, en tres idiomas
                </h2>
                <p className="mt-6 leading-relaxed text-[var(--field-soft)]">
                  En el Colorado, un guide le cuenta qué mirar y cuándo: la
                  audioguía de{" "}
                  <Link
                    href={`/puntos/${featurePoint.slug}`}
                    className="font-semibold text-[var(--field)] underline decoration-[var(--color-rust)] decoration-2 underline-offset-4"
                  >
                    {featurePoint.name}
                  </Link>{" "}
                  está disponible en español, guaraní e inglés.
                </p>

                <dl className="mt-9 space-y-4 border-t border-[var(--rule)] pt-7">
                  {[
                    ["Descargable", "Se guarda en el teléfono y suena sin cobertura"],
                    ["Segundo plano", "Seguí caminando con la pantalla apagada"],
                    ["Tres velocidades", "Para el que camina rápido y el que se detiene"],
                  ].map(([term, detail]) => (
                    <div key={term} className="flex gap-3">
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-[var(--color-rust)]"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-[0.95rem] font-semibold text-[var(--field)]">
                          {term}
                        </dt>
                        <dd className="text-[0.9rem] text-[var(--field-soft)]">
                          {detail}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="lg:col-span-7">
                <AudioPlayer tracks={featuredAudio} />
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredAudio.map((t) => (
                    <span
                      key={t.id}
                      className="stamp text-[var(--color-ink-3)]"
                    >
                      {LANGUAGE_LABEL[t.language]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- Rutas */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-wide max-w-xl text-[clamp(1.9rem,4vw,3rem)] text-[var(--field)]">
            Cinco circuitos para caminar con plan
          </h2>
          <Link
            href="/rutas"
            className="label inline-flex items-center gap-2 border-b-2 border-[var(--color-rust)] pb-1 transition-colors duration-150 hover:text-[var(--color-rust)]"
          >
            Todas las rutas
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {routes.slice(0, 3).map((route) => (
            <li key={route.id}>
              <Link
                href={`/rutas/${route.slug}`}
                className="group plate block h-full p-6 transition-colors duration-150 hover:border-[var(--color-rust)]"
              >
                <span className="label text-[var(--color-rust)]">{route.theme}</span>
                <span className="display mt-3 block text-[1.5rem] leading-tight text-[var(--field)]">
                  {route.name}
                </span>
                <span className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--rule)] pt-4">
                  <span className="measure text-[0.75rem] text-[var(--field-soft)]">
                    {formatDistance(route.distance)}
                  </span>
                  <span className="measure text-[0.75rem] text-[var(--field-soft)]">
                    {formatDuration(route.duration)}
                  </span>
                  {route.difficulty && (
                    <span className="measure text-[0.75rem] text-[var(--color-rust)]">
                      {DIFFICULTY_LABEL[route.difficulty]}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {featuredRoute && (
          <p className="mt-8 text-[0.9rem] text-[var(--field-soft)]">
            La más corta,{" "}
            <Link
              href={`/rutas/${featuredRoute.slug}`}
              className="font-semibold text-[var(--field)] underline decoration-[var(--color-rust)] decoration-2 underline-offset-4"
            >
              {featuredRoute.name}
            </Link>
            , son {formatDistance(featuredRoute.distance)} y{" "}
            {formatDuration(featuredRoute.duration)}: entra por la mañana y volvés
            antes del calor.
          </p>
        )}
      </section>

      {/* ---------------------------------------------------------- Guías */}
      <section className="border-y-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display-wide max-w-2xl text-[clamp(1.9rem,4vw,3rem)]">
              Quienes conocen el territorio
            </h2>
            <Link
              href="/guias"
              className="label inline-flex items-center gap-2 border-b-2 border-[var(--color-sunset)] pb-1 transition-colors duration-150 hover:text-[var(--color-sunset)]"
            >
              Ver la comunidad
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-5 max-w-2xl text-[0.9rem] leading-relaxed text-[var(--color-paper)]/60">
            Perfiles de demostración: los carga el equipo del programa para
            mostrar cómo se ve la comunidad. Las personas reales aparecen cuando
            comparten su material y el equipo lo verifica.
          </p>

          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 6).map((guide) => (
              <li key={guide.id} className="border-t border-[var(--color-paper)]/25 pt-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--color-paper)]/40 text-[0.9rem] font-semibold">
                    {guide.user.name?.charAt(0) ?? "G"}
                  </span>
                  <span>
                    <span className="flex items-center gap-2">
                      <span className="text-[1.05rem] font-semibold">
                        {guide.user.name}
                      </span>
                      {guide.isVerified && (
                        <CheckCircle2
                          className="size-4 text-[var(--color-turq)]"
                          aria-label="Perfil verificado"
                        />
                      )}
                    </span>
                    <span className="measure block text-[0.68rem] text-[var(--color-paper)]/55">
                      {guide.specialties.join(" · ")}
                    </span>
                  </span>
                </div>
                <p className="mt-4 line-clamp-3 text-[0.9rem] leading-relaxed text-[var(--color-paper)]/70">
                  {guide.bio}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------ CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="display-wide text-[clamp(2rem,4.5vw,3.5rem)] text-[var(--field)]">
              Instalala y andá sin cobertura
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-[var(--field-soft)]">
              EcoGuide se instala como aplicación desde el navegador. Después
              queda en la pantalla de inicio, ocupa poco y abre sin datos: el
              mapa, las audioguías y las rutas ya están en el teléfono.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/mapa" className="btn btn-primary">
                <Download className="size-4" aria-hidden="true" />
                Empezar por el mapa
              </Link>
              <Link href="/registrarse" className="btn btn-ghost">
                <Users className="size-4" aria-hidden="true" />
                Publicar como guía
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="plate p-6">
              <h3 className="display text-[1.4rem] text-[var(--field)]">
                Para guías y promotores
              </h3>
              <p className="mt-3 leading-relaxed text-[var(--field-soft)]">
                Creas tu perfil, subís tus audioguías y tus clips, y quedan
                pendientes de moderación hasta que se aprueban. Después aparecen
                junto a la ficha del punto, con tu nombre.
              </p>
              <ul className="mt-6 space-y-3 border-t border-[var(--rule)] pt-5">
                {[
                  "Perfil con especialidades e idiomas",
                  "Cápsulas de audio y video con moderación",
                  "Tus puntos en el mapa de la provincia",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-[var(--color-rust)]"
                      aria-hidden="true"
                    />
                    <span className="text-[0.95rem]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
