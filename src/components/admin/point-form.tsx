"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { savePoint } from "@/app/admin/actions";
import { CATEGORY_LABEL } from "@/lib/constants";
import type { PointCategory } from "@/generated/prisma/enums";

export interface PointFormValues {
  id?: string;
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  latitude: string;
  longitude: string;
  altitude: string;
  address: string;
  region: string;
  category: PointCategory;
  tags: string;
  qrCode: string;
}

const EMPTY: PointFormValues = {
  slug: "",
  name: "",
  shortDesc: "",
  description: "",
  latitude: "",
  longitude: "",
  altitude: "",
  address: "",
  region: "",
  category: "PARQUE_NACIONAL",
  tags: "",
  qrCode: "",
};

export function PointForm({
  initial,
  onDone,
}: {
  initial?: PointFormValues;
  onDone?: () => void;
}) {
  const [values, setValues] = useState<PointFormValues>(initial ?? EMPTY);
  type FormState = { error?: string };

  const [state, action, pending] = useActionState<FormState, FormData>(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await savePoint(formData);
      if (result.ok) {
        toast.success("Punto guardado.");
        onDone?.();
        return { error: undefined };
      }
      return { error: result.error };
    },
    { error: undefined },
  );

  function set<K extends keyof PointFormValues>(field: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value as PointFormValues[K] }));
  }

  return (
    <form action={action} className="plate p-6">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="p-name" className="label text-[var(--field-soft)]">
            Nombre
          </label>
          <input id="p-name" name="name" required value={values.name} onChange={set("name")} className="field mt-2" />
        </div>

        <div>
          <label htmlFor="p-slug" className="label text-[var(--field-soft)]">
            Slug
          </label>
          <input id="p-slug" name="slug" required value={values.slug} onChange={set("slug")} className="field measure mt-2" />
        </div>

        <div>
          <label htmlFor="p-qr" className="label text-[var(--field-soft)]">
            Código de señalética
          </label>
          <input id="p-qr" name="qrCode" value={values.qrCode} onChange={set("qrCode")} className="field measure mt-2" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="p-short" className="label text-[var(--field-soft)]">
            Bajada
          </label>
          <textarea id="p-short" name="shortDesc" rows={2} value={values.shortDesc} onChange={set("shortDesc")} className="field mt-2" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="p-desc" className="label text-[var(--field-soft)]">
            Descripción
          </label>
          <textarea id="p-desc" name="description" rows={5} required value={values.description} onChange={set("description")} className="field mt-2" />
        </div>

        <div>
          <label htmlFor="p-lat" className="label text-[var(--field-soft)]">
            Latitud
          </label>
          <input id="p-lat" name="latitude" required value={values.latitude} onChange={set("latitude")} className="field measure mt-2" />
        </div>

        <div>
          <label htmlFor="p-lon" className="label text-[var(--field-soft)]">
            Longitud
          </label>
          <input id="p-lon" name="longitude" required value={values.longitude} onChange={set("longitude")} className="field measure mt-2" />
        </div>

        <div>
          <label htmlFor="p-alt" className="label text-[var(--field-soft)]">
            Altura (m)
          </label>
          <input id="p-alt" name="altitude" value={values.altitude} onChange={set("altitude")} className="field measure mt-2" />
        </div>

        <div>
          <label htmlFor="p-cat" className="label text-[var(--field-soft)]">
            Categoría
          </label>
          <select id="p-cat" name="category" value={values.category} onChange={set("category")} className="field mt-2">
            {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="p-region" className="label text-[var(--field-soft)]">
            Departamento
          </label>
          <input id="p-region" name="region" value={values.region} onChange={set("region")} className="field mt-2" />
        </div>

        <div>
          <label htmlFor="p-addr" className="label text-[var(--field-soft)]">
            Dirección
          </label>
          <input id="p-addr" name="address" value={values.address} onChange={set("address")} className="field mt-2" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="p-tags" className="label text-[var(--field-soft)]">
            Palabras (separadas por coma)
          </label>
          <input id="p-tags" name="tags" value={values.tags} onChange={set("tags")} className="field mt-2" />
        </div>
      </div>

      {state.error && (
        <p role="alert" className="mt-5 border-l-2 border-[var(--color-rust)] bg-[var(--color-rust)]/10 px-3 py-2 text-[0.9rem]">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary mt-6">
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Plus className="size-4" aria-hidden="true" />
        )}
        Guardar el punto
      </button>
    </form>
  );
}
