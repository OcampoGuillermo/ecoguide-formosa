"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, CircleDot, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export function RouteProgress({
  routeId,
  initialProgress,
  stops,
}: {
  routeId: string;
  initialProgress: number;
  stops: { id: string; notes: string | null }[];
}) {
  const router = useRouter();
  const [progress, setProgress] = useState(initialProgress);
  const [saving, setSaving] = useState(false);

  const reached = Math.round((progress / 100) * stops.length);

  async function save(next: number) {
    setSaving(true);
    setProgress(next);
    try {
      const res = await fetch("/api/rutas/progreso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeId, progress: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "No pudimos guardar el progreso.");
      } else {
        toast.success(
          next >= 100 ? "Ruta completada. Buen trekking." : "Progreso guardado.",
        );
      }
    } catch {
      toast.error("Sin conexión: el progreso no se guardó.");
    } finally {
      setSaving(false);
      router.refresh();
    }
  }

  return (
    <div className="plate p-5">
      <p className="display text-[1.25rem] text-[var(--field)]">Tu avance</p>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="measure text-[2rem] leading-none text-[var(--field)]">
          {progress}%
        </span>
        <span className="text-[0.875rem] text-[var(--field-soft)]">
          {reached} de {stops.length} paradas
        </span>
      </div>

      <div className="mt-4 h-2 w-full bg-[var(--color-ink)]/12">
        <div
          className="h-full bg-[var(--color-rust)] transition-[width] duration-300 ease-[var(--ease-out)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {stops.map((stop, index) => {
          const done = index < reached;
          const next = index === reached;
          return (
            <button
              key={stop.id}
              type="button"
              disabled={saving || index > reached}
              onClick={() => save(Math.round(((index + 1) / stops.length) * 100))}
              className={cn(
                "inline-flex items-center gap-2 border px-3 py-2 text-[0.875rem] transition-colors duration-150",
                done
                  ? "border-[var(--acento-vivo)] text-[var(--acento-vivo)]"
                  : next
                    ? "border-[var(--color-rust)] text-[var(--field)] hover:bg-[var(--color-rust)] hover:text-[var(--color-chalk)]"
                    : "cursor-not-allowed border-[var(--rule)] text-[var(--field-soft)] opacity-60",
              )}
            >
              {done ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : next ? (
                <CircleDot className="size-3.5" aria-hidden="true" />
              ) : (
                <Flag className="size-3.5" aria-hidden="true" />
              )}
              Parada {index + 1}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-[0.875rem] text-[var(--field-soft)]">
        El progreso queda en tu cuenta y se ve desde cualquier dispositivo.
      </p>
    </div>
  );
}
