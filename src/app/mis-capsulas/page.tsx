import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { SubmissionForm } from "@/components/submission-form";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mis cápsulas",
  description: "Enviá tus audioguías y tus clips a moderación y seguí su estado.",
};

const STATUS_LABEL = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
} as const;

const STATUS_COLOR = {
  PENDING: "var(--color-sunset)",
  APPROVED: "var(--color-olive)",
  REJECTED: "var(--color-rust)",
} as const;

export default async function MisCapsulasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/ingresar?callbackUrl=/mis-capsulas");

  const submissions = await prisma.contentSubmission.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { reviewedBy: { select: { name: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        title="Mis cápsulas"
        lead="Cada audioguía, clip o texto que envías queda en revisión técnica antes de aparecer junto a la ficha del punto."
      />

      <section className="mt-10">
        <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--field)]">
          Enviar una cápsula
        </h2>
        <div className="mt-6">
          <SubmissionForm />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--field)]">
          Lo que enviaste
        </h2>

        {submissions.length === 0 ? (
          <div className="mt-6 border border-dashed border-[var(--rule-strong)] p-10 text-center">
            <p className="text-[1rem] text-[var(--field)]">
              Todavía no enviaste ninguna cápsula.
            </p>
            <p className="mx-auto mt-2 max-w-md text-[0.9rem] leading-relaxed text-[var(--field-soft)]">
              Cuando envíes una, vas a ver acá si está pendiente, aprobada o
              rechazada, con la nota de quien la revisó.
            </p>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-[var(--rule)] border-t-2 border-[var(--color-ink)]">
            {submissions.map((sub) => (
              <li key={sub.id} className="py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="display text-[1.25rem] text-[var(--field)]">
                      {sub.title}
                    </p>
                    <p className="measure mt-1 text-[0.72rem] text-[var(--field-soft)]">
                      {sub.kind} · {sub.language} · {formatDate(sub.createdAt)}
                    </p>
                  </div>
                  <span className="stamp" style={{ color: STATUS_COLOR[sub.status] }}>
                    {STATUS_LABEL[sub.status]}
                  </span>
                </div>
                {sub.reviewNote && (
                  <p className="mt-3 border-t-2 border-[var(--rule-strong)] pt-2 text-[0.88rem] leading-relaxed text-[var(--field-soft)]">
                    {sub.reviewNote}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-[0.9rem] text-[var(--field-soft)]">
          ¿Necesitás otra cosa?{" "}
          <Link
            href="/guias"
            className="font-semibold text-[var(--field)] underline decoration-[var(--color-rust)] decoration-2 underline-offset-4"
          >
            Volvé a la comunidad
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
