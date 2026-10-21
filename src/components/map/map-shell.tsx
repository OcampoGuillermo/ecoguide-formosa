"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { PointListItem } from "@/lib/queries";

const MapCanvas = dynamic(() => import("./map-canvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[var(--surface)]">
      <p className="label text-[var(--field-soft)]">Cargando el mapa…</p>
    </div>
  ),
});

export function MapShell({
  points,
  activeSlug,
  onSelect,
  className,
}: {
  points: PointListItem[];
  activeSlug?: string | null;
  onSelect?: (slug: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <MapCanvas points={points} activeSlug={activeSlug} onSelect={onSelect} />
    </div>
  );
}
