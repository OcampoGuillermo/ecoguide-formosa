import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Sin conexión",
  description: "Estás sin cobertura: esto es lo que podés seguir usando.",
};

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:py-28">
      <WifiOff className="mx-auto size-10 text-[var(--color-rust)]" aria-hidden="true" />
      <h1 className="display mt-7 text-[clamp(2.25rem,6vw,3.5rem)] text-[var(--color-ink)]">
        Sin conexión
      </h1>
      <p className="measure-wide mx-auto mt-6 leading-relaxed text-[var(--field-soft)]">
        No hay red ahora. Si ya abriste el mapa o escuchaste una audioguía,
        eso sigue en el teléfono y se puede usar igual.
      </p>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/mapa" className="btn btn-primary">
          Abrir el mapa guardado
        </Link>
        <Link href="/mis-rutas" className="btn btn-ghost">
          Ver mis rutas
        </Link>
      </div>
    </div>
  );
}
