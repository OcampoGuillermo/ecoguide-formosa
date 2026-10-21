import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { listStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sobre el proyecto",
  description:
    "EcoGuide Formosa: una plataforma de ecoturismo digital para la provincia, con audioguías de guías locales, mapa, rutas y escáner QR.",
};

export default async function SobrePage() {
  const stats = await listStats();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        title="Sobre EcoGuide Formosa"
        lead="Una plataforma de ecoturismo digital para la provincia de Formosa, hecha con y para los guías locales del territorio."
      />

      <div className="measure-wide mt-10 space-y-5 leading-relaxed text-[var(--color-ink)]">
        <p>
          EcoGuide Formosa reúne en una sola aplicación el mapa de los lugares
          que importan, la voz de quien los conoce y la señalética física del
          lugar. El visitante abre el mapa, encuentra el punto, escucha la
          audioguía y sigue una ruta. Todo funciona sin cobertura, porque el
          uso real es de pie, en el lugar, con el teléfono en una mano.
        </p>
        <p>
          El proyecto forma parte de un programa de innovación turística que
          trabaja dos cosas juntas: la infraestructura técnica y la
          formación de las personas que la usan. Los talleres de oratoria y de
          redes sociales del programa alimentan el contenido de la plataforma:
          cada audioguía es la voz de un guía que aprendió a contarla.
        </p>
        <p>
          No cobramos nada y no hay banner de funcionalidad de pago. Las
          reseñas, las calificaciones y las cifras que se ven en la plataforma
          son reales: cuando no hay datos, la pantalla lo dice.
        </p>
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-px border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-4">
        {[
          ["Puntos publicados", stats.points],
          ["Rutas", stats.routes],
          ["Audioguías", stats.audio],
          ["Guías", stats.guides],
        ].map(([label, value]) => (
          <div key={label as string} className="bg-[var(--surface)] p-5">
            <dt className="label text-[var(--field-soft)]">{label}</dt>
            <dd className="measure mt-2 text-[2rem] leading-none text-[var(--color-ink)]">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 border border-[var(--rule-strong)] p-6">
        <p className="display text-[1.3rem] text-[var(--color-ink)]">
          La comunidad
        </p>
        <p className="measure-wide mt-3 leading-relaxed text-[var(--field-soft)]">
          Si sos guía o promotor turístico de la provincia,{" "}
          <Link
            href="/registrarse"
            className="font-semibold text-[var(--color-ink)] underline decoration-[var(--color-rust)] decoration-2 underline-offset-4"
          >
            creá tu perfil
          </Link>{" "}
          y subí tus audioguías. Todo lo que envías pasa por moderación técnica
          antes de publicarse.
        </p>
      </div>
    </div>
  );
}
