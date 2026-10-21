import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MapPin, Mountain, Route as RouteIcon } from "lucide-react";
import { AudioPlayer } from "@/components/audio-player";
import { QrCode } from "@/components/qr-code";
import { VisitRecorder } from "@/components/visit-recorder";
import { getPointBySlug } from "@/lib/queries";
import { CATEGORY_LABEL, DIFFICULTY_LABEL, SITE } from "@/lib/constants";
import { formatAltitude, formatCoordinate, formatDistance } from "@/lib/format";
import type { VisitSource } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const point = await getPointBySlug(slug);
  if (!point) return { title: "Punto no encontrado" };
  return {
    title: point.name,
    description: point.shortDesc ?? point.description.slice(0, 160),
    openGraph: {
      title: `${point.name} | EcoGuide Formosa`,
      description: point.shortDesc ?? point.description.slice(0, 160),
      images: ["/og-image.png"],
    },
  };
}

export default async function PointPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ de?: string }>;
}) {
  const { slug } = await params;
  const { de } = await searchParams;
  const point = await getPointBySlug(slug);
  if (!point || point.status !== "PUBLISHED") notFound();

  const source: VisitSource =
    de === "qr" ? "QR" : de === "ruta" ? "ROUTE" : de === "busqueda" ? "SEARCH" : "MAP";

  const video = point.videos[0];
  const reviews = point.reviews;
  const average =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;

  // Una ruta puede pasar varias veces por el mismo punto (bucles): la ficha
  // lista cada ruta una sola vez.
  const routesThrough = Array.from(
    new Map(point.routeStops.map((stop) => [stop.route.slug, stop.route])).values(),
  );

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <VisitRecorder pointId={point.id} source={source} />
      <Link
        href="/mapa"
        className="label inline-flex items-center gap-2 text-[var(--field-soft)] transition-colors duration-150 hover:text-[var(--color-rust)]"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver al mapa
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ------------------------------------------------ Columna principal */}
        <div className="lg:col-span-7">
          <h1 className="display mt-3 text-[clamp(2.25rem,6vw,4.5rem)] text-[var(--field)]">
            {point.name}
          </h1>

          {point.shortDesc && (
            <p className="measure-wide mt-6 text-[1.1rem] leading-relaxed text-[var(--field-soft)]">
              {point.shortDesc}
            </p>
          )}

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-[var(--rule)] py-6 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: MapPin, label: "Latitud", value: formatCoordinate(point.latitude, "lat") },
              { icon: MapPin, label: "Longitud", value: formatCoordinate(point.longitude, "lon") },
              { icon: Mountain, label: "Altura", value: formatAltitude(point.altitude) },
              { icon: MapPin, label: "Departamento", value: point.region ?? "—" },
              { icon: MapPin, label: "Categoría", value: CATEGORY_LABEL[point.category] },
            ].map((item) => (
              <div key={item.label}>
                <dt className="label text-[var(--field-soft)]">{item.label}</dt>
                <dd className="measure mt-1.5 text-[0.8rem] text-[var(--field)]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          {point.address && (
            <p className="mt-5 text-[0.9rem] text-[var(--field-soft)]">{point.address}</p>
          )}

          <div className="measure-wide mt-9 space-y-4 leading-relaxed text-[var(--field)]">
            {point.description.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* ------------------------------------------------------ Audioguías */}
          <section className="mt-12">
            <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--field)]">
              Audioguías
            </h2>
            <p className="mt-3 max-w-lg leading-relaxed text-[var(--field-soft)]">
              La narración de este lugar, en los tres idiomas del programa. Bajala
              antes de salir: después suena sin cobertura.
            </p>
            <div className="mt-6">
              <AudioPlayer
                tracks={point.audioGuides.map((a) => ({
                  id: a.id,
                  language: a.language,
                  title: a.title,
                  audioUrl: a.audioUrl,
                  duration: a.duration,
                  voice: a.voice,
                }))}
              />
            </div>

            {point.audioGuides[0]?.narrator && (
              <p className="mt-4 text-[0.88rem] text-[var(--field-soft)]">
                Narrada por{" "}
                <span className="font-semibold text-[var(--field)]">
                  {point.audioGuides[0].narrator.name}
                </span>
                {point.audioGuides[0].narrator.profile?.isVerified && (
                  <span className="text-[var(--color-rust)]"> · guía verificada</span>
                )}
              </p>
            )}
          </section>

          {/* ----------------------------------------------------------- Reseñas */}
          <section className="mt-12">
            <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--field)]">
              Qué cuentan quienes lo visited
            </h2>
            {reviews.length > 0 ? (
              <ul className="mt-6 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
                {reviews.map((review) => (
                  <li key={review.id} className="py-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-semibold text-[var(--field)]">
                        {review.user.name ?? "Visitante"}
                      </p>
                      <p className="measure text-[0.75rem] text-[var(--color-rust)]">
                        {review.rating}/5
                      </p>
                    </div>
                    {review.comment && (
                      <p className="mt-2 leading-relaxed text-[var(--field-soft)]">
                        {review.comment}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 border border-dashed border-[var(--rule-strong)] p-8 text-center">
                <p className="text-[1rem] text-[var(--field)]">
                  Todavía no hay reseñas de este lugar.
                </p>
                <p className="mx-auto mt-2 max-w-sm text-[0.92rem] leading-relaxed text-[var(--field-soft)]">
                  No publicamos calificaciones de ejemplo: la primera reseña la
                  escribe alguien que estuvo ahí.
                </p>
              </div>
            )}
            {average !== null && (
              <p className="measure mt-4 text-[0.8rem] text-[var(--field-soft)]">
                Promedio {average.toFixed(1)} sobre {reviews.length} reseñas
              </p>
            )}
          </section>
        </div>

        {/* --------------------------------------------------------- Columna lateral */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            {video && (
              <figure className="plate p-4">
                <p className="label text-[var(--field-soft)]">Clip vertical</p>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="w-full max-w-[240px] shrink-0">
                    <video
                      src={video.videoUrl}
                      poster={video.thumbnailUrl ?? undefined}
                      controls
                      playsInline
                      preload="none"
                      className="aspect-[9/16] w-full border border-[var(--rule-strong)] bg-[var(--color-ink)] object-cover"
                    >
                    </video>
                  </div>
                  <figcaption className="min-w-0">
                    <p className="display text-[1.25rem] leading-tight text-[var(--field)]">
                      {video.title}
                    </p>
                    {video.description && (
                      <p className="mt-2 text-[0.9rem] leading-relaxed text-[var(--field-soft)]">
                        {video.description}
                      </p>
                    )}
                    <p className="measure mt-3 text-[0.72rem] text-[var(--field-soft)]">
                      {Math.round(video.duration)} s &middot; vertical
                    </p>
                  </figcaption>
                </div>
              </figure>
            )}

            <div className="plate mt-6 p-5">
              <p className="display text-[1.15rem] text-[var(--field)]">
                Señalética del lugar
              </p>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--field-soft)]">
                Este es el código que va impreso en el cartel del sendero. El
                escáner de la app lo reconoce y abre esta misma ficha.
              </p>
              <div className="mt-5 flex items-center gap-5">
                <div className="border border-[var(--rule-strong)] bg-white p-3">
                  <QrCode value={point.qrCode ?? point.slug} size={132} />
                </div>
                <div>
                  <p className="measure text-[0.72rem] text-[var(--field-soft)]">Código</p>
                  <p className="measure mt-1 text-[1rem] text-[var(--field)]">
                    {point.qrCode ?? "—"}
                  </p>
                  <p className="mt-2 max-w-[15rem] text-[0.8rem] leading-relaxed text-[var(--field-soft)]">
                    Es el mismo código que se imprime en el cartel: el escáner lo
                    lee y abre esta ficha.
                  </p>
                </div>
              </div>
            </div>

            {routesThrough.length > 0 && (
              <div className="plate mt-6 p-5">
                <p className="display flex items-center gap-2 text-[1.15rem] text-[var(--field)]">
                  <RouteIcon className="size-4" aria-hidden="true" />
                  Está en estas rutas
                </p>
                <ul className="mt-4 divide-y divide-[var(--rule)]">
                  {routesThrough.map((route) => (
                    <li key={route.slug} className="py-3">
                      <Link href={`/rutas/${route.slug}`} className="group block">
                        <span className="block font-semibold text-[var(--field)] transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1">
                          {route.name}
                        </span>
                        <span className="measure mt-1 block text-[0.72rem] text-[var(--field-soft)]">
                          {formatDistance(route.distance)}
                          {route.difficulty
                            ? ` · ${DIFFICULTY_LABEL[route.difficulty]}`
                            : ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 border border-[var(--rule-strong)] p-5">
              <p className="label text-[var(--field-soft)]">Palabras</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {point.tags.map((tag) => (
                  <li key={tag} className="stamp text-[var(--color-ink-3)]">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-center gap-4 border-t-2 border-[var(--color-ink)] pt-5">
              <Image
                src="/icons/icon-192x192.png"
                alt=""
                width={52}
                height={52}
                className="rounded-full"
              />
              <p className="text-[0.85rem] leading-relaxed text-[var(--field-soft)]">
                Ficha de {SITE.name}. El contenido lo cargan guías de la
                provincia y pasa por moderación.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
