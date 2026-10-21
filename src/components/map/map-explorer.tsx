"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LocateFixed, SlidersHorizontal } from "lucide-react";
import { MapShell } from "@/components/map/map-shell";
import { CATEGORY_COLOR, CATEGORY_LABEL } from "@/lib/constants";
import { formatCoordinate } from "@/lib/format";
import type { PointListItem } from "@/lib/queries";
import type { PointCategory } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER: PointCategory[] = [
  "PARQUE_NACIONAL",
  "RESERVA_NATURAL",
  "MONUMENTO",
  "LAGUNA",
  "RIO",
  "CULTURA",
  "COMUNIDAD",
  "SENDERISMO",
];

export function MapExplorer({
  points,
  regions,
}: {
  points: PointListItem[];
  regions: string[];
}) {
  const router = useRouter();
  const [category, setCategory] = useState<PointCategory | "TODOS">("TODOS");
  const [region, setRegion] = useState<string>("TODOS");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      points.filter(
        (p) =>
          (category === "TODOS" || p.category === category) &&
          (region === "TODOS" || p.region === region),
      ),
    [points, category, region],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of points) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, [points]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display-wide text-[clamp(2rem,5vw,3.5rem)] text-[var(--field)]">
          Mapa de la provincia
        </h1>
        <p className="measure text-[0.75rem] text-[var(--field-soft)]">
          {filtered.length} de {points.length} puntos
        </p>
      </div>

      <div className="mt-8 border-y border-[var(--rule)] py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label mr-1 inline-flex items-center gap-2 text-[var(--field-soft)]">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            Categoría
          </span>
          <button
            type="button"
            onClick={() => setCategory("TODOS")}
            aria-pressed={category === "TODOS"}
            className={cn(
              "stamp transition-colors duration-150",
              category === "TODOS"
                ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                : "text-[var(--field-soft)] hover:text-[var(--field)]",
            )}
          >
            Todas
          </button>
          {CATEGORY_ORDER.filter((c) => counts.get(c)).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "stamp transition-colors duration-150",
                category === c
                  ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "text-[var(--field-soft)] hover:text-[var(--field)]",
              )}
            >
              <span
                className="size-2"
                style={{ backgroundColor: CATEGORY_COLOR[c] }}
                aria-hidden="true"
              />
              {CATEGORY_LABEL[c]}
              <span className="measure opacity-70">{counts.get(c)}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label htmlFor="region" className="label text-[var(--field-soft)]">
            Departamento
          </label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="field w-auto min-w-48"
          >
            <option value="TODOS">Todos los departamentos</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="h-[26rem] overflow-hidden border-2 border-[var(--color-ink)] sm:h-[34rem]">
            <MapShell
              points={filtered}
              activeSlug={activeSlug}
              onSelect={setActiveSlug}
              className="h-full"
            />
          </div>
        </div>

        <div className="lg:col-span-4">
          <ul className="max-h-[34rem] divide-y divide-[var(--rule)] overflow-y-auto border-y-2 border-[var(--color-ink)]">
            {filtered.map((point) => (
              <li key={point.id}>
                <Link
                  href={`/puntos/${point.slug}`}
                  onClick={() => setActiveSlug(point.slug)}
                  className={cn(
                    "group block px-1 py-4 transition-colors duration-150 hover:wash",
                    activeSlug === point.slug && "wash",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-1.5 size-2.5 shrink-0"
                      style={{ backgroundColor: CATEGORY_COLOR[point.category] }}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="display block text-[1.2rem] leading-tight text-[var(--field)] transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1">
                        {point.name}
                      </span>
                      <span className="measure mt-1 block text-[0.68rem] text-[var(--field-soft)]">
                        {formatCoordinate(point.latitude, "lat")} ·{" "}
                        {formatCoordinate(point.longitude, "lon")}
                      </span>
                      {point.shortDesc && (
                        <span className="mt-2 block text-[0.88rem] leading-relaxed text-[var(--field-soft)]">
                          {point.shortDesc}
                        </span>
                      )}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
            {!filtered.length && (
              <li className="px-1 py-10 text-center">
                <p className="text-[0.95rem] text-[var(--field-soft)]">
                  No hay puntos con esos filtros.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategory("TODOS");
                    setRegion("TODOS");
                  }}
                  className="btn btn-ghost mt-4"
                >
                  <LocateFixed className="size-4" aria-hidden="true" />
                  Quitar los filtros
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-[0.85rem] text-[var(--field-soft)]">
        ¿Preferís buscar por la señalética del lugar?{" "}
        <button
          type="button"
          onClick={() => router.push("/escanear")}
          className="font-semibold text-[var(--field)] underline decoration-[var(--color-rust)] decoration-2 underline-offset-4"
        >
          Escaneá el código QR
        </button>{" "}
        y la ficha se abre sola.
      </p>
    </div>
  );
}
