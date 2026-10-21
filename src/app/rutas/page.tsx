import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { listRoutes } from "@/lib/queries";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { formatDistance, formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rutas",
  description:
    "Cinco circuitos ecoturísticos por la provincia de Formosa, con distancia, tiempo, dificultad y las paradas ordenadas.",
};

const DIFFICULTY_STAMP: Record<string, string> = {
  FACIL: "var(--color-olive)",
  MEDIO: "var(--color-sunset)",
  DIFICIL: "var(--color-rust)",
};

export default async function RutasPage() {
  const routes = await listRoutes();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        title="Rutas"
        lead="Cada circuito tiene paradas ordenadas, un tiempo estimado y una dificultad. El progreso se guarda en el teléfono, así que podés hacer la mitad y volver otro día."
      />

      <ul className="mt-10 divide-y divide-[var(--rule)] border-t-2 border-[var(--color-ink)]">
        {routes.map((route) => (
          <li key={route.id}>
            <Link
              href={`/rutas/${route.slug}`}
              className="group grid gap-5 py-8 transition-colors duration-150 hover:wash md:grid-cols-12 md:items-start md:gap-8"
            >
              <div className="md:col-span-7">
                <h2 className="display text-[clamp(1.75rem,3.5vw,2.4rem)] leading-tight text-[var(--field)] transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1">
                  {route.name}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span
                    className="stamp"
                    style={{
                      color: DIFFICULTY_STAMP[route.difficulty ?? "FACIL"],
                    }}
                  >
                    {route.difficulty
                      ? DIFFICULTY_LABEL[route.difficulty]
                      : "Sin nivel"}
                  </span>
                  <span className="label text-[var(--field-soft)]">{route.theme}</span>
                </div>
                {route.description && (
                  <p className="measure-wide mt-3 leading-relaxed text-[var(--field-soft)]">
                    {route.description}
                  </p>
                )}
              </div>

              <div className="md:col-span-3">
                <dl className="flex flex-wrap gap-x-6 gap-y-2 md:flex-col md:gap-2">
                  <div className="flex gap-2">
                    <dt className="label text-[var(--field-soft)]">Distancia</dt>
                    <dd className="measure text-[0.78rem] text-[var(--field)]">
                      {formatDistance(route.distance)}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="label text-[var(--field-soft)]">Tiempo</dt>
                    <dd className="measure text-[0.78rem] text-[var(--field)]">
                      {formatDuration(route.duration)}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="label text-[var(--field-soft)]">Paradas</dt>
                    <dd className="measure text-[0.78rem] text-[var(--field)]">
                      {route.stops.length}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-center gap-2 md:col-span-2 md:justify-end">
                <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[var(--field)]">
                  Ver el recorrido
                  <ArrowRight
                    className="size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-12 border border-[var(--rule-strong)] p-6">
        <p className="display flex items-center gap-2 text-[1.25rem] text-[var(--field)]">
          <MapPin className="size-4" aria-hidden="true" />
          Antes de salir
        </p>
        <p className="measure-wide mt-3 leading-relaxed text-[var(--field-soft)]">
          Descargá la ruta y las audioguías desde el mapa antes de salir del pueblo.
          La señalética cambia con el estado de los caminos: en temporada de
          lluvias hay senderos que se cierran y los guarda parque avisan en la
          garita de entrada.
        </p>
      </div>
    </div>
  );
}
