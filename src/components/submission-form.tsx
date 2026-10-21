"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { LANGUAGE_SHORT } from "@/lib/constants";
import type { Language } from "@/generated/prisma/enums";

export function SubmissionForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    kind: "TEXT" as "TEXT" | "AUDIO" | "VIDEO",
    title: "",
    body: "",
    audioUrl: "",
    videoUrl: "",
    language: "ES" as Language,
    pointSlug: "",
  });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/capacidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          audioUrl: form.audioUrl || undefined,
          videoUrl: form.videoUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No pudimos enviar la cápsula.");
        setLoading(false);
        return;
      }
      toast.success("Cápsula enviada. Queda pendiente de moderación.");
      router.refresh();
      setForm({ ...form, title: "", body: "", audioUrl: "", videoUrl: "" });
    } catch {
      toast.error("Sin conexión: no pudimos enviar la cápsula.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="plate p-6">
      <fieldset>
        <legend className="label text-[var(--field-soft)]">Tipo de cápsula</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["TEXT", "Texto"],
              ["AUDIO", "Audio"],
              ["VIDEO", "Video"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="cursor-pointer border border-[var(--rule-strong)] px-3 py-2 text-[0.85rem] transition-colors duration-150 has-[:checked]:border-[var(--color-ink)] has-[:checked]:bg-[var(--color-ink)] has-[:checked]:text-[var(--color-paper)]"
            >
              <input
                type="radio"
                name="kind"
                value={value}
                checked={form.kind === value}
                onChange={() =>
                  setForm((f) => ({ ...f, kind: value, audioUrl: "", videoUrl: "" }))
                }
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="cap-title" className="label text-[var(--field-soft)]">
          Título
        </label>
        <input
          id="cap-title"
          required
          minLength={3}
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="field mt-2"
          placeholder="El yacaré de la laguna, al atardecer"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="cap-body" className="label text-[var(--field-soft)]">
          La narración o el texto
        </label>
        <textarea
          id="cap-body"
          rows={5}
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          className="field mt-2"
          placeholder="Contá lo que la gente necesita saber en ese lugar."
        />
      </div>

      {form.kind === "AUDIO" && (
        <div className="mt-5">
          <label htmlFor="cap-audio" className="label text-[var(--field-soft)]">
            Archivo de audio
          </label>
          <input
            id="cap-audio"
            required
            value={form.audioUrl}
            onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
            className="field measure mt-2"
            placeholder="/media/audio/mi-audio.mp3"
          />
        </div>
      )}

      {form.kind === "VIDEO" && (
        <div className="mt-5">
          <label htmlFor="cap-video" className="label text-[var(--field-soft)]">
            Archivo de video
          </label>
          <input
            id="cap-video"
            required
            value={form.videoUrl}
            onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
            className="field measure mt-2"
            placeholder="/media/video/mi-clip.mp4"
          />
        </div>
      )}

      <div className="mt-5">
        <label htmlFor="cap-lang" className="label text-[var(--field-soft)]">
          Idioma
        </label>
        <select
          id="cap-lang"
          value={form.language}
          onChange={(e) =>
            setForm((f) => ({ ...f, language: e.target.value as Language }))
          }
          className="field mt-2 w-auto"
        >
          {(["ES", "GN", "EN"] as Language[]).map((l) => (
            <option key={l} value={l}>
              {LANGUAGE_SHORT[l]}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary mt-7">
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        Enviar a moderación
      </button>
      <p className="mt-4 text-[0.85rem] leading-relaxed text-[var(--field-soft)]">
        Nada se publica sin revisión técnica. Vas a ver el estado de cada
        envío en esta misma pantalla.
      </p>
    </form>
  );
}
