import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Qué datos guarda EcoGuide Formosa y para qué los usa.",
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        title="Privacidad"
        lead="La plataforma no cobra, no vende datos y no pide permisos que no necesite para funcionar."
      />

      <div className="measure-wide mt-10 space-y-8 leading-relaxed text-[var(--field)]">
        <section>
          <h2 className="display text-[1.4rem] text-[var(--field)]">
            Qué guardamos
          </h2>
          <ul className="mt-3 space-y-2">
            {[
              "Tu correo y tu nombre, si creás una cuenta.",
              "El avance de las rutas que empezaste.",
              "Las audioguías y los clips que subís como guía.",
              "Un registro de las visitas a cada punto, para el equipo del programa saber qué se usa.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 bg-[var(--color-rust)]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="display text-[1.4rem] text-[var(--field)]">
            Qué no hacemos
          </h2>
          <p className="mt-3">
            No hay publicidad, no hay perfiles publicitarios, no hay cookies de
            seguimiento entre sitios y no cedemos datos a terceros con fines
            comerciales. El permiso de ubicación se pide solo cuando querés
            ver dónde estás en el mapa, y el permiso de cámara solo cuando
            escaneás un código.
          </p>
        </section>

        <section>
          <h2 className="display text-[1.4rem] text-[var(--field)]">
            Ubicación y cámara
          </h2>
          <p className="mt-3">
            La app funciona sin permiso de ubicación: el mapa muestra la
            provincia completa y vos lo recorrés a mano. Si querés el punto
            azul con tu posición, hay que dar el permiso.
          </p>
        </section>

        <section>
          <h2 className="display text-[1.4rem] text-[var(--field)]">
            Datos en el teléfono
          </h2>
          <p className="mt-3">
            Los mapas, las fichas y los audios descargados quedan en el
            dispositivo, en el almacenamiento del navegador. Borrar los datos
            del sitio los elimina.
          </p>
        </section>
      </div>
    </div>
  );
}
