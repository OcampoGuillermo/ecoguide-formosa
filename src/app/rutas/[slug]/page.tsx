import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { MapShell } from "@/components/map/map-shell";
import { RouteProgress } from "@/components/route-progress";
import { getRouteBySlug } from "@/lib/queries";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { formatDistance, formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = await getRouteBySlug(slug);
  if (!route) return { title: "Ruta no encontrada" };
  return {
    title: route.name,
    description: route.description ?? `Ruta ${route.name} en la provincia de Formosa.`,
  };
}

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = await getRouteBySlug(slug);
  if (!route || !route.isPublic) notFound();

  const session = await auth();
  const run = session?.user?.id
    ? await prisma.routeVisit.findUnique({
        where: { routeId_userId: { routeId: route.id, userId: session.user.id } },
        select: { progress: true },
      })
    : null;

  const points = route.stops.map((s) => ({
    id: s.point.id,
    slug: s.point.slug,
    name: s.point.name,
    shortDesc: s.point.shortDesc,
    latitude: s.point.latitude,
    longitude: s.point.longitude,
    altitude: s.point.altitude,
    region: s.point.region,
    category: s.point.category,
    tags: s.point.tags,
    coverImage: s.point.coverImage,
    qrCode: s.point.qrCode,
    audioGuides: s.point.audioGuides,
    videos: s.point.videos,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/rutas"
        className="label inline-flex items-center gap-2 text-[var(--field-soft)] transition-colors duration-150 hover:text-[var(--color-rust)]"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Todas las rutas
      </Link>

      <header className="mt-8 border-b-2 border-[var(--color-ink)] pb-8">
        <h1 className="display mt-3 text-[clamp(2.25rem,6vw,4.5rem)] text-[var(--field)]">
          {route.name}
        </h1>
        {route.description && (
          <p className="measure-wide mt-5 leading-relaxed text-[var(--field-soft)]">
            {route.description}
          </p>
        )}
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {[
            ["Distancia", formatDistance(route.distance)],
            ["Tiempo", formatDuration(route.duration)],
            [
              "Dificultad",
              route.difficulty ? DIFFICULTY_LABEL[route.difficulty] : "—",
            ],
            ["Tema", route.theme ?? "—"],
            ["Paradas", String(route.stops.length)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="label text-[var(--field-soft)]">{label}</dt>
              <dd className="measure mt-1.5 text-[1.05rem] text-[var(--field)]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--field)]">
            Las paradas
          </h2>
          <ol className="mt-6">
            {route.stops.map((stop, index) => (
              <li key={stop.id} className="border-t border-[var(--rule)] py-6 first:border-t-2 first:border-[var(--color-ink)]">
                <div className="flex gap-4">
                  <span className="measure mt-1 text-[0.8rem] text-[var(--color-rust)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/puntos/${stop.point.slug}`}
                      className="group inline-flex items-start gap-2"
                    >
                      <span className="display text-[1.35rem] leading-tight text-[var(--field)] transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1">
                        {stop.point.name}
                      </span>
                      <MapPin
                        className="mt-1.5 size-4 shrink-0 text-[var(--field-soft)]"
                        aria-hidden="true"
                      />
                    </Link>
                    {stop.notes && (
                      <p className="measure-wide mt-2 leading-relaxed text-[var(--field-soft)]">
                        {stop.notes}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <div className="h-72 overflow-hidden border-2 border-[var(--color-ink)]">
              <MapShell points={points} className="h-full" />
            </div>
            <div className="mt-6">
              <RouteProgress
                routeId={route.id}
                initialProgress={run?.progress ?? 0}
                stops={route.stops.map((s) => ({ id: s.id, notes: s.notes }))}
              />
            </div>
            {!session?.user && (
              <p className="mt-4 text-[0.88rem] leading-relaxed text-[var(--field-soft)]">
                <Link
                  href="/ingresar"
                  className="font-semibold text-[var(--field)] underline decoration-[var(--color-rust)] decoration-2 underline-offset-4"
                >
                  Iniciá sesión
                </Link>{" "}
                para guardar el avance de la ruta.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
