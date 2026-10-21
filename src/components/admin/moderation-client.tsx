"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { reviewSubmission } from "@/app/admin/actions";
import { LANGUAGE_LABEL } from "@/lib/constants";
import type { Language, SubmissionKind, SubmissionStatus } from "@/generated/prisma/enums";

export interface AdminSubmission {
  id: string;
  kind: SubmissionKind;
  status: SubmissionStatus;
  title: string;
  body: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  language: Language;
  createdAt: string;
  author: string;
}

export function ModerationClient({ submissions }: { submissions: AdminSubmission[] }) {
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>({});

  function decide(id: string, decision: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      const result = await reviewSubmission(id, decision, notes[id]);
      if (result.ok) {
        toast.success(decision === "APPROVED" ? "Cápsula aprobada." : "Cápsula rechazada.");
      }
    });
  }

  return (
    <div>
      <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--field)]">
        Moderación de la comunidad
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-[var(--field-soft)]">
        Cada cápsula llega con su autor y su contenido. Se revisa que el audio
        se entienda, que la ubicación sea correcta y que no haya material de
        terceros sin permiso.
      </p>

      {submissions.length === 0 ? (
        <p className="mt-8 border border-dashed border-[var(--rule-strong)] p-8 text-center text-[0.875rem] text-[var(--field-soft)]">
          No hay cápsulas esperando revisión.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {submissions.map((sub) => (
            <li key={sub.id} className="plate p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="display text-[1.25rem] text-[var(--field)]">
                    {sub.title}
                  </p>
                  <p className="measure mt-1 text-[0.75rem] text-[var(--field-soft)]">
                    {sub.author} · {sub.kind} · {LANGUAGE_LABEL[sub.language]} ·{" "}
                    {new Date(sub.createdAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <span
                  className="stamp"
                  style={{
                    color:
                      sub.status === "APPROVED"
                        ? "var(--color-olive)"
                        : sub.status === "REJECTED"
                          ? "var(--color-rust)"
                          : "var(--color-sunset)",
                  }}
                >
                  {sub.status}
                </span>
              </div>

              {sub.body && (
                <p className="measure-wide mt-4 leading-relaxed text-[var(--field-soft)]">
                  {sub.body}
                </p>
              )}

              {sub.audioUrl && (
                <audio controls src={sub.audioUrl} className="mt-4 w-full" />
              )}
              {sub.videoUrl && (
                <video controls src={sub.videoUrl} className="mt-4 w-full max-w-xs" />
              )}

              <label htmlFor={`note-${sub.id}`} className="label mt-5 block text-[var(--field-soft)]">
                Nota para el autor
              </label>
              <textarea
                id={`note-${sub.id}`}
                rows={2}
                value={notes[sub.id] ?? ""}
                onChange={(e) => setNotes((n) => ({ ...n, [sub.id]: e.target.value }))}
                className="field mt-2"
                placeholder="Qué hay que corregir, o por qué se aprobó."
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => decide(sub.id, "APPROVED")}
                  className="btn btn-ink"
                >
                  <Check className="size-4" aria-hidden="true" />
                  Aprobar
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => decide(sub.id, "REJECTED")}
                  className="btn btn-ghost"
                >
                  <X className="size-4" aria-hidden="true" />
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
