"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PointListItem } from "@/lib/queries";
import { CATEGORY_LABEL } from "@/lib/constants";
import { formatCoordinate } from "@/lib/format";

const FALLBACK_CENTER: [number, number] = [-26.18, -58.6];
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function centerOf(points: PointListItem[]): [number, number] {
  if (!points.length) return FALLBACK_CENTER;
  const lat = points.reduce((s, p) => s + p.latitude, 0) / points.length;
  const lng = points.reduce((s, p) => s + p.longitude, 0) / points.length;
  return [lat, lng];
}

function markerIcon(label: string, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="marker-badge${active ? " marker-badge--active" : ""}">${label}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  });
}

function popupHtml(point: PointListItem) {
  const desc =
    point.shortDesc && point.shortDesc.length > 96
      ? `${point.shortDesc.slice(0, 96)}…`
      : point.shortDesc ?? "";
  return `
    <p class="label" style="color:var(--color-rust);margin:0 0 4px">${CATEGORY_LABEL[point.category]}</p>
    <p style="font-weight:700;font-size:15px;line-height:1.15;margin:0 0 4px;color:var(--color-ink)">${point.name}</p>
    ${desc ? `<p style="color:var(--color-ink-3);margin:0 0 6px">${desc}</p>` : ""}
    <p class="measure" style="font-size:10.5px;color:var(--color-ink-3);margin:0 0 6px">
      ${formatCoordinate(point.latitude, "lat")} &middot; ${formatCoordinate(point.longitude, "lon")}
    </p>
    <a href="/puntos/${point.slug}" class="label" style="color:var(--color-rust);text-decoration:underline">Abrir la ficha</a>
  `;
}

/**
 * El mapa se arma con Leaflet directo: el contenedor ya tiene su alto
 * definitivo cuando se crea la instancia, y el ciclo de vida queda bajo
 * control (crear, redimensionar, destruir).
 */
export default function MapCanvas({
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    let cancelled = false;

    const map = L.map(node, {
      center: centerOf(points),
      zoom: 7,
      scrollWheelZoom: false,
      attributionControl: true,
    });
    mapRef.current = map;

    const tiles = L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 18 }).addTo(map);

    const markers = new Map<string, L.Marker>();
    for (const point of points) {
      const marker = L.marker([point.latitude, point.longitude], {
        icon: markerIcon(CATEGORY_LABEL[point.category].charAt(0), point.slug === activeSlug),
        title: point.name,
      })
        .addTo(map)
        .bindPopup(popupHtml(point));
      marker.on("click", () => onSelectRef.current?.(point.slug));
      markers.set(point.slug, marker);
    }
    markersRef.current = markers;

    const resize = () => {
      if (cancelled) return;
      map.invalidateSize({ animate: false });
    };

    // Leaflet mide el contenedor al crearse: hay que revalidar cuando ya
    // tiene su alto real.
    requestAnimationFrame(resize);
    window.setTimeout(resize, 250);

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    observer?.observe(node);
    window.addEventListener("resize", resize);

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      map.remove();
      mapRef.current = null;
      markersRef.current = new Map();
    };
    // El mapa se crea una vez; los puntos se re-sincronizan en otro efecto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Altas de los marcadores cuando cambia el conjunto de puntos.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const existing = markersRef.current;
    for (const [slug, marker] of existing) {
      if (!points.some((p) => p.slug === slug)) {
        marker.remove();
        existing.delete(slug);
      }
    }
    for (const point of points) {
      const marker = existing.get(point.slug);
      if (!marker) {
        const created = L.marker([point.latitude, point.longitude], {
          icon: markerIcon(
            CATEGORY_LABEL[point.category].charAt(0),
            point.slug === activeSlug,
          ),
          title: point.name,
        })
          .addTo(map)
          .bindPopup(popupHtml(point));
        created.on("click", () => onSelectRef.current?.(point.slug));
        existing.set(point.slug, created);
      } else {
        marker.setLatLng([point.latitude, point.longitude]);
      }
    }
  }, [points, activeSlug]);

  // El marcador activo cambia de tinta.
  useEffect(() => {
    for (const point of points) {
      const marker = markersRef.current.get(point.slug);
      if (!marker) continue;
      marker.setIcon(
        markerIcon(
          CATEGORY_LABEL[point.category].charAt(0),
          point.slug === activeSlug,
        ),
      );
    }
  }, [points, activeSlug]);

  // Marcador de la posicion del visitante.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const marker = L.marker(position ?? [0, 0], {
      icon: L.divIcon({
        className: "",
        html: '<div class="marker-badge" style="background:var(--color-rust);font-size:10px">YO</div>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      }),
    });
    let added = false;
    if (position) {
      marker.addTo(map);
      added = true;
    }
    return () => {
      if (added) marker.remove();
    };
  }, [position]);

  function locate() {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(here);
        mapRef.current?.setView(here, 12);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 },
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden", className)}
    >
      <button
        type="button"
        onClick={locate}
        disabled={locating}
        className="absolute right-3 bottom-3 z-[500] inline-flex size-11 items-center justify-center border border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] transition-colors duration-150 hover:bg-[var(--color-rust)] disabled:opacity-60"
        aria-label="Mi ubicación"
        title="Mi ubicación"
      >
        <Crosshair
          className={cn("size-5", locating && "animate-spin")}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
