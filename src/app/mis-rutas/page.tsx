import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { formatDistance, formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mis rutas",
  description: "Las rutas que empezaste y hasta dónde llegaste.",
};

export default async function MisRutasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/ingresar?callbackUrl=/mis-rutas");

  const runs = await prisma.routeVisit.findMany({
    where: { userId: session.user.id },
    orderBy: { startedAt: "desc" },
    include: {
      route: {
        select: {
          slug: true,
          name: true,
          distance: true,
          duration: true,
          difficulty: true,
          theme: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        title="Mis rutas"
        lead="Tu avance se guarda en tu cuenta. Si entrás desde el teléfono en el lugar, el progreso sigue ahí."
      />

      {runs.length === 0 ? (
        <div className="mt-10 border border-dashed border-[var(--rule-strong)] p-10 text-center">
          <p className="text-[1rem] text-[var(--color-ink)]">
            Todavía no empezaste ninguna ruta.
          </p>
          <p className="mx-auto mt-2 max-w-md text-[0.9rem] leading-relaxed text-[var(--field-soft)]">
            Elegí un circuito y marcá las paradas a medida que avanzás. La
            primera queda guardada apenas la empezás.
          </p>
          <Link href="/rutas" className="btn btn-primary mt-6">
            Ver las rutas
          </Link>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-[var(--rule)] border-t-2 border-[var(--color-ink)]">
          {runs.map((run) => (
            <li key={run.id} className="py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <Link
                  href={`/rutas/${run.route.slug}`}
                  className="display text-[1.4rem] text-[var(--color-ink)] transition-transform duration-200 ease-[var(--ease-out)] hover:translate-x-1"
                >
                  {run.route.name}
                </Link>
                <span className="measure text-[0.85rem] text-[var(--color-rust)]">
                  {run.progress}%
                </span>
              </div>
              <p className="measure mt-2 text-[0.75rem] text-[var(--field-soft)]">
                {run.route.theme} · {formatDistance(run.route.distance)} ·{" "}
                {formatDuration(run.route.duration)}
                {run.route.difficulty
                  ? ` · ${DIFFICULTY_LABEL[run.route.difficulty]}`
                  : ""}
              </p>
              <div className="mt-3 h-1.5 w-full bg-[var(--color-ink)]/12">
                <div
                  className="h-full bg-[var(--color-rust)]"
                  style={{ width: `${run.progress}%` }}
                />
              </div>
              {run.completedAt && (
                <p className="measure mt-2 text-[0.72rem] text-[var(--color-olive)]">
                  Completada
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
