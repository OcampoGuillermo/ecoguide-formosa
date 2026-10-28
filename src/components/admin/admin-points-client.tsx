"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { setPointStatus } from "@/app/admin/actions";
import { PointForm, type PointFormValues } from "@/components/admin/point-form";
import { CATEGORY_LABEL } from "@/lib/constants";
import type { PointCategory, PointStatus } from "@/generated/prisma/enums";

export interface AdminPoint {
  id: string;
  slug: string;
  name: string;
  shortDesc: string | null;
  description: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
  address: string | null;
  region: string | null;
  category: PointCategory;
  tags: string[];
  qrCode: string | null;
  status: PointStatus;
  audioCount: number;
  videoCount: number;
}

export function AdminPointsClient({ points }: { points: AdminPoint[] }) {
  const [editing, setEditing] = useState<AdminPoint | null>(null);
  const [creating, setCreating] = useState(false);

  function toForm(p: AdminPoint): PointFormValues {
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortDesc: p.shortDesc ?? "",
      description: p.description,
      latitude: String(p.latitude),
      longitude: String(p.longitude),
      altitude: p.altitude != null ? String(p.altitude) : "",
      address: p.address ?? "",
      region: p.region ?? "",
      category: p.category,
      tags: p.tags.join(", "),
      qrCode: p.qrCode ?? "",
    };
  }

  async function toggleStatus(point: AdminPoint) {
    const next = point.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";
    const result = await setPointStatus(point.id, next);
    if (result.ok) {
      toast.success(
        next === "PUBLISHED" ? "Punto publicado." : "Punto archivado.",
      );
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--field)]">
          Puntos de interés
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setCreating((v) => !v);
          }}
          className="btn btn-primary"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nuevo punto
        </button>
      </div>

      {creating && (
        <div className="mt-6">
          <PointForm onDone={() => setCreating(false)} />
        </div>
      )}

      {editing && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="display text-[1.25rem] text-[var(--field)]">
              Editando {editing.name}
            </p>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="label text-[var(--field-soft)] hover:text-[var(--field)]"
            >
              Cerrar
            </button>
          </div>
          <PointForm initial={toForm(editing)} onDone={() => setEditing(null)} />
        </div>
      )}

      <ul className="mt-8 divide-y divide-[var(--rule)] border-t-2 border-[var(--color-ink)]">
        {points.map((point) => (
          <li key={point.id} className="py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="display text-[1.25rem] text-[var(--field)]">
                  {point.name}
                </p>
                <p className="measure mt-1 text-[0.75rem] text-[var(--field-soft)]">
                  {point.slug} · {CATEGORY_LABEL[point.category]} ·{" "}
                  {point.region ?? "—"} · {point.audioCount} audios ·{" "}
                  {point.videoCount} clips
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="stamp"
                  style={{
                    color:
                      point.status === "PUBLISHED"
                        ? "var(--color-olive)"
                        : "var(--color-rust)",
                  }}
                >
                  {point.status === "PUBLISHED" ? "Publicado" : "Archivado"}
                </span>
                <button
                  type="button"
                  onClick={() => setEditing(point)}
                  className="label border border-[var(--rule-strong)] px-3 py-1.5 transition-colors duration-150 hover:border-[var(--color-ink)]"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => toggleStatus(point)}
                  className="label border border-[var(--rule-strong)] px-3 py-1.5 transition-colors duration-150 hover:border-[var(--color-ink)]"
                >
                  {point.status === "PUBLISHED" ? "Archivar" : "Publicar"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {points.length === 0 && (
        <p className="mt-8 border border-dashed border-[var(--rule-strong)] p-8 text-center text-[0.875rem] text-[var(--field-soft)]">
          Todavía no hay puntos cargados.
        </p>
      )}
    </div>
  );
}
