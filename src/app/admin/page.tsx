import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { CATEGORY_LABEL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [points, published, routes, guides, demoGuides, pending, visits, events, recent] =
    await Promise.all([
      prisma.pointOfInterest.count(),
      prisma.pointOfInterest.count({ where: { status: "PUBLISHED" } }),
      prisma.route.count(),
      prisma.guideProfile.count(),
      prisma.guideProfile.count({ where: { isDemo: true } }),
      prisma.contentSubmission.count({ where: { status: "PENDING" } }),
      prisma.visit.count(),
      prisma.analyticsEvent.count(),
      prisma.contentSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { author: { select: { name: true } } },
      }),
    ]);

  const cards = [
    { label: "Puntos publicados", value: published, total: points, href: "/admin/puntos" },
    { label: "Rutas", value: routes, href: "/admin/rutas" },
    { label: "Perfiles de guía", value: guides, href: "/admin/usuarios" },
    { label: "Cápsulas por moderar", value: pending, href: "/admin/moderacion" },
    { label: "Visitas registradas", value: visits, href: "/admin/analiticas" },
    { label: "Eventos", value: events, href: "/admin/analiticas" },
  ];

  return (
    <div className="space-y-12">
      <section>
        <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--field)]">
          Estado de la plataforma
        </h2>
        <dl className="mt-6 grid gap-px border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group bg-[var(--surface)] p-5 transition-colors duration-150 hover:wash"
            >
              <dt className="label text-[var(--field-soft)]">{card.label}</dt>
              <dd className="measure mt-2 text-[2rem] leading-none text-[var(--field)] transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1">
                {card.value}
                {card.total !== undefined && (
                  <span className="text-[1rem] text-[var(--field-soft)]"> / {card.total}</span>
                )}
              </dd>
            </Link>
          ))}
        </dl>
        {demoGuides > 0 && (
          <p className="mt-4 border-t-2 border-[var(--color-rust)] pt-3 text-[0.875rem] leading-relaxed text-[var(--field-soft)]">
            Los {demoGuides} perfiles de guía cargados son de demostración: los
            sube el equipo del programa para mostrar cómo se ve el panel. La
            verificación se hace a mano desde la pestaña de usuarios.
          </p>
        )}
      </section>

      <section>
        <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--field)]">
          Últimas cápsulas
        </h2>
        {recent.length === 0 ? (
          <p className="mt-4 border border-dashed border-[var(--rule-strong)] p-8 text-center text-[0.875rem] text-[var(--field-soft)]">
            Todavía no llegó ninguna cápsula de la comunidad.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
            {recent.map((sub) => (
              <li key={sub.id} className="flex flex-wrap items-baseline justify-between gap-3 py-3">
                <span className="min-w-0">
                  <span className="block truncate text-[0.98rem] font-semibold text-[var(--field)]">
                    {sub.title}
                  </span>
                  <span className="measure text-[0.7rem] text-[var(--field-soft)]">
                    {sub.author.name ?? "Guía"} · {sub.kind} ·{" "}
                    {formatDateTime(sub.createdAt)}
                  </span>
                </span>
                <span className="stamp text-[var(--field-soft)]">{sub.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--field)]">
          Puntos por categoría
        </h2>
        <CategoryBreakdown />
      </section>
    </div>
  );
}

async function CategoryBreakdown() {
  const grouped = await prisma.pointOfInterest.groupBy({
    by: ["category"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
  });
  const total = grouped.reduce((s, g) => s + g._count._all, 0) || 1;

  return (
    <ul className="mt-5 space-y-3">
      {grouped.map((g) => (
        <li key={g.category}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[1rem] text-[var(--field)]">
              {CATEGORY_LABEL[g.category]}
            </span>
            <span className="measure text-[0.78rem] text-[var(--field-soft)]">
              {g._count._all}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full bg-[var(--color-ink)]/12">
            <div
              className="h-full bg-[var(--color-turq-2)]"
              style={{ width: `${(g._count._all / total) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
