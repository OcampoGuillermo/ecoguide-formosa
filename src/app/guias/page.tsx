import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { listGuides } from "@/lib/queries";
import { LANGUAGE_LABEL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guías locales",
  description:
    "Las guías de turismo de Formosa que cargan las audioguías, los clips y las fichas de los puntos de la provincia.",
};

export default async function GuiasPage() {
  const guides = await listGuides();
  const demoCount = guides.filter((g) => g.isDemo).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        title="Guías locales"
        lead={
          guides.length === 0
            ? "Cada audioguía de EcoGuide tiene una voz y una persona. Todavía no hay perfiles publicados: los guías que se registran aparecen acá después de la verificación del equipo."
            : "Cada audioguía de EcoGuide tiene una voz y una persona. Estos son los guías y promotores que mantienen el contenido de la provincia: sus especialidades, sus idiomas y los puntos donde trabajan."
        }
      />

      {demoCount > 0 && (
        <p className="mt-8 border-t-2 border-[var(--color-rust)] pt-4 text-[0.875rem] leading-relaxed text-[var(--field-soft)]">
          <strong className="font-semibold text-[var(--field)]">
            Perfiles de demostración:
          </strong>{" "}
          los {demoCount} perfiles de esta lista los carga el equipo del programa
          para mostrar cómo se ve la comunidad. Las personas reales aparecen
          cuando comparten su material y el equipo lo verifica.
        </p>
      )}

      {guides.length === 0 ? (
        <div className="mt-10 border border-dashed border-[var(--rule-strong)] p-10 text-center">
          <p className="text-[1rem] text-[var(--field)]">
            Todavía no hay perfiles publicados.
          </p>
          <p className="measure mx-auto mt-2 text-[0.875rem] leading-relaxed text-[var(--field-soft)]">
            Si sos guía o promotor de Formosa,{" "}
            <Link
              href="/registrarse"
              className="font-semibold text-[var(--field)] underline decoration-[var(--color-rust)] decoration-2 underline-offset-4"
            >
              creá tu cuenta
            </Link>{" "}
            y tu perfil aparece acá cuando el equipo lo verifica.
          </p>
        </div>
      ) : (
        <ul className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.id} className="border-t-2 border-[var(--color-ink)] pt-6">
              <div className="flex items-start gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-[var(--color-ink)] text-[1.125rem] font-semibold text-[var(--field)]">
                  {guide.user.name?.charAt(0) ?? "G"}
                </span>
                <div className="min-w-0">
                  <h2 className="flex flex-wrap items-center gap-2 text-[1.25rem] font-semibold text-[var(--field)]">
                    {guide.user.name}
                    {guide.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[0.75rem] font-medium tracking-wide text-[var(--acento-verificado)] uppercase">
                        <CheckCircle2 className="size-3.5" aria-hidden="true" />
                        Verificado
                      </span>
                    )}
                    {guide.isDemo && (
                      <span className="stamp text-[var(--color-rust)]">
                        Demostración
                      </span>
                    )}
                  </h2>
                  <p className="measure mt-1 text-[0.75rem] text-[var(--field-soft)]">
                    {guide.region} · {guide.user._count.points} puntos ·{" "}
                    {guide.user._count.narrations} narraciones
                  </p>
                </div>
              </div>

              {guide.bio && (
                <p className="measure-wide mt-5 leading-relaxed text-[var(--field-soft)]">
                  {guide.bio}
                </p>
              )}

              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                <div>
                  <dt className="label text-[var(--field-soft)]">Especialidades</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-2">
                    {guide.specialties.map((s) => (
                      <span key={s} className="stamp text-[var(--field-soft)]">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="label text-[var(--field-soft)]">Idiomas</dt>
                  <dd className="mt-1.5 text-[0.875rem] text-[var(--field)]">
                    {guide.languages.map((l) => LANGUAGE_LABEL[l]).join(" · ")}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[var(--rule)] pt-4">
                {guide.whatsapp && (
                  <a
                    href={`https://wa.me/${guide.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[var(--field)] underline decoration-[var(--color-rust)] decoration-2 underline-offset-4"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                )}
                {guide.instagram && (
                  <a
                    href={`https://instagram.com/${guide.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.875rem] text-[var(--field-soft)] underline-offset-4 transition-colors duration-150 hover:text-[var(--field)] hover:underline"
                  >
                    {guide.instagram}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-16 border border-[var(--rule-strong)] p-6">
        <p className="display text-[1.25rem] text-[var(--field)]">
          ¿Trabajás guiding en Formosa?
        </p>
        <p className="measure-wide mt-3 leading-relaxed text-[var(--field-soft)]">
          Las reseñas de los guías aparecen cuando alguien las escribe: no
          publicamos calificaciones de ejemplo. Si querés que tu perfil figure
          acá,{" "}
          <Link
            href="/registrarse"
            className="font-semibold text-[var(--field)] underline decoration-[var(--color-rust)] decoration-2 underline-offset-4"
          >
            creá tu cuenta
          </Link>{" "}
          y cargá tu primera cápsula.
        </p>
      </div>
    </div>
  );
}
