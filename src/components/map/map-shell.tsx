"use client";

import dynamic from "next/dynamic";
import type { PointListItem } from "@/lib/queries";

const MapCanvas = dynamic(() => import("./map-canvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[var(--color-paper-2)]">
      <p className="label text-[var(--color-ink-3)]">Cargando el mapa…</p>
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
    <MapCanvas
      points={points}
      activeSlug={activeSlug}
      onSelect={onSelect}
      className={className}
    />
  );
}
