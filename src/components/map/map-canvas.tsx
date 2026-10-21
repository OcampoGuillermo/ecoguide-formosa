"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Crosshair } from "lucide-react";
import type { PointListItem } from "@/lib/queries";
import { CATEGORY_LABEL } from "@/lib/constants";
import { formatCoordinate } from "@/lib/format";

const FALLBACK_CENTER: [number, number] = [-26.18, -58.6];

function markerIcon(label: string, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="marker-badge${active ? " marker-badge--active" : ""}">${label}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  });
}

function UserLocator({ onLocated }: { onLocated: (pos: [number, number]) => void }) {
  const map = useMap();

  useEffect(() => {
    const onMove = () => {
      const center = map.getCenter();
      onLocated([center.lat, center.lng]);
    };
    map.on("moveend", onMove);
    return () => {
      map.off("moveend", onMove);
    };
  }, [map, onLocated]);

  useMapEvents({
    click(e) {
      onLocated([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
}

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
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  const center = useMemo<[number, number]>(() => {
    if (!points.length) return FALLBACK_CENTER;
    const lat = points.reduce((s, p) => s + p.latitude, 0) / points.length;
    const lng = points.reduce((s, p) => s + p.longitude, 0) / points.length;
    return [lat, lng];
  }, [points]);

  function locate() {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 },
    );
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom={false}
        className="h-full w-full"
        attributionControl
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={18}
        />

        {position && (
          <Marker
            position={position}
            icon={L.divIcon({
              className: "",
              html: '<div class="marker-badge" style="background:var(--color-rust);font-size:10px">YO</div>',
              iconSize: [34, 34],
              iconAnchor: [17, 17],
            })}
          />
        )}

        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            icon={markerIcon(
              CATEGORY_LABEL[point.category].charAt(0),
              point.slug === activeSlug,
            )}
            eventHandlers={{ click: () => onSelect?.(point.slug) }}
          >
            <Popup>
              <p className="label" style={{ color: "var(--color-rust)", marginBottom: 4 }}>
                {CATEGORY_LABEL[point.category]}
              </p>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  lineHeight: 1.15,
                  marginBottom: 4,
                  color: "var(--color-ink)",
                }}
              >
                {point.name}
              </p>
              {point.shortDesc && (
                <p style={{ color: "var(--color-ink-3)", marginBottom: 6 }}>
                  {point.shortDesc.length > 96
                    ? `${point.shortDesc.slice(0, 96)}…`
                    : point.shortDesc}
                </p>
              )}
              <p
                className="measure"
                style={{ fontSize: 10.5, color: "var(--color-ink-3)", marginBottom: 6 }}
              >
                {formatCoordinate(point.latitude, "lat")} ·{" "}
                {formatCoordinate(point.longitude, "lon")}
              </p>
              <a
                href={`/puntos/${point.slug}`}
                className="label"
                style={{ color: "var(--color-rust)", textDecoration: "underline" }}
              >
                Abrir la ficha
              </a>
            </Popup>
          </Marker>
        ))}

        <UserLocator onLocated={(pos) => setPosition(pos)} />
      </MapContainer>

      <button
        type="button"
        onClick={locate}
        disabled={locating}
        className="absolute right-3 bottom-3 z-[500] inline-flex size-11 items-center justify-center border border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] transition-colors duration-150 hover:bg-[var(--color-rust)] disabled:opacity-60"
        aria-label="Mi ubicación"
        title="Mi ubicación"
      >
        <Crosshair
          className={`size-5 ${locating ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
