"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { saveRoute } from "@/app/admin/actions";
import { DIFFICULTY_LABEL } from "@/lib/constants";

export interface AdminRoute {
  id?: string;
  slug: string;
  name: string;
  description: string;
  distance: string;
  duration: string;
  difficulty: string;
  theme: string;
  stops: string;
}

const EMPTY: AdminRoute = {
  slug: "",
  name: "",
  description: "",
  distance: "",
  duration: "",
  difficulty: "FACIL",
  theme: "",
  stops: "",
};

export function RouteForm({
  initial,
  pointSlugs,
  onDone,
}: {
  initial?: AdminRoute;
  pointSlugs: string[];
  onDone?: () => void;
}) {
  const [values, setValues] = useState<AdminRoute>(initial ?? EMPTY);
  type FormState = { error?: string };

  const [state, action, pending] = useActionState<FormState, FormData>(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await saveRoute(formData);
      if (result.ok) {
        toast.success("Ruta guardada.");
        onDone?.();
        return { error: undefined };
      }
      return { error: result.error };
    },
    { error: undefined },
  );

  function set(field: keyof AdminRoute) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  return (
    <form action={action} className="plate p-6">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="r-name" className="label text-[var(--field-soft)]">Nombre</label>
          <input id="r-name" name="name" required value={values.name} onChange={set("name")} className="field mt-2" />
        </div>
        <div>
          <label htmlFor="r-slug" className="label text-[var(--field-soft)]">Slug</label>
          <input id="r-slug" name="slug" required value={values.slug} onChange={set("slug")} className="field measure mt-2" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="r-desc" className="label text-[var(--field-soft)]">Descripción</label>
          <textarea id="r-desc" name="description" rows={3} value={values.description} onChange={set("description")} className="field mt-2" />
        </div>

        <div>
          <label htmlFor="r-dist" className="label text-[var(--field-soft)]">Distancia (km)</label>
          <input id="r-dist" name="distance" value={values.distance} onChange={set("distance")} className="field measure mt-2" />
        </div>
        <div>
          <label htmlFor="r-dur" className="label text-[var(--field-soft)]">Tiempo (min)</label>
          <input id="r-dur" name="duration" value={values.duration} onChange={set("duration")} className="field measure mt-2" />
        </div>

        <div>
          <label htmlFor="r-diff" className="label text-[var(--field-soft)]">Dificultad</label>
          <select id="r-diff" name="difficulty" value={values.difficulty} onChange={set("difficulty")} className="field mt-2">
            {Object.entries(DIFFICULTY_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="r-theme" className="label text-[var(--field-soft)]">Tema</label>
          <input id="r-theme" name="theme" value={values.theme} onChange={set("theme")} className="field mt-2" placeholder="fauna, aves, río…" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="r-stops" className="label text-[var(--field-soft)]">
            Paradas (slugs separados por coma, en orden)
          </label>
          <input id="r-stops" name="stops" value={values.stops} onChange={set("stops")} className="field measure mt-2" />
          <p className="measure mt-2 text-[0.68rem] text-[var(--field-soft)]">
           Disponibles: {pointSlugs.join(", ")}
          </p>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="alert">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary mt-6">
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
        Guardar la ruta
      </button>
    </form>
  );
}
