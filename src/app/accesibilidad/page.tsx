import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Accesibilidad",
  description:
    "Cómo está construida EcoGuide Formosa para que se pueda usar en el lugar, con una mano, a pleno sol y sin conexión.",
};

export default function AccesibilidadPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        title="Accesibilidad"
        lead="La app se usa de pie, al sol, con una mano ocupada y a veces sin datos. Eso manda sobre el diseño."
      />

      <div className="measure-wide mt-10 space-y-8 leading-relaxed text-[var(--color-ink)]">
        <section>
          <h2 className="display text-[1.4rem] text-[var(--color-ink)]">
            Contraste y lectura a plein air
          </h2>
          <p className="mt-3">
            La tinta principal sobre el papel del cartel supera el contraste
            mínimo de WCAG AA, y los textos secundarios mantienen el mismo
            criterio. Los objetivos táctiles miden 44 px o más: se pulsan con
            un dedo, sin mirar.
          </p>
        </section>

        <section>
          <h2 className="display text-[1.4rem] text-[var(--color-ink)]">
            Teclado y foco
          </h2>
          <p className="mt-3">
            Todo se puede recorrer con el teclado y el foco siempre está
            visible, con un anillo terracota sobre el papel. Los controles de
            reproducción de audio responden a las flechas izquierda y derecha
            para avanzar y retroceder.
          </p>
        </section>

        <section>
          <h2 className="display text-[1.4rem] text-[var(--color-ink)]">
            Movimiento
          </h2>
          <p className="mt-3">
            La app respeta la preferencia de movimiento reducido del sistema:
            cuando está activa, las transiciones se desactivan y se conserva la
            información, no la animación.
          </p>
        </section>

        <section>
          <h2 className="display text-[1.4rem] text-[var(--color-ink)]">
            Sin conexión
          </h2>
          <p className="mt-3">
            El mapa, las fichas, las audioguías y los clips quedan guardados en
            el teléfono. El service worker guarda los tiles del mapa a medida
            que los vas viendo, así que la segunda visita funciona aunque no
            haya señal.
          </p>
        </section>

        <section>
          <h2 className="display text-[1.4rem] text-[var(--color-ink)]">
            Idiomas
          </h2>
          <p className="mt-3">
            La interfaz está en español. El contenido de audio está disponible
            en español, guaraní e inglés, que son los tres idiomas del
            programa.
          </p>
        </section>
      </div>

      <p className="mt-12 text-[0.92rem] text-[var(--field-soft)]">
        Si encontraste algo que no se puede usar bien, contale al equipo del
        programa: la accesibilidad se corrige, no se documenta.
      </p>
    </div>
  );
}
