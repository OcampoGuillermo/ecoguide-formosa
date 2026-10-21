import { prisma } from "@/lib/prisma";
import { CATEGORY_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [visits, byPoint, bySource, daily] = await Promise.all([
    prisma.visit.count({ where: { visitedAt: { gte: since } } }),
    prisma.visit.groupBy({
      by: ["pointId"],
      where: { visitedAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { pointId: "desc" } },
      take: 12,
    }),
    prisma.visit.groupBy({
      by: ["source"],
      where: { visitedAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { source: "desc" } },
    }),
    prisma.$queryRaw<
      { day: Date; total: bigint }[]
    >`SELECT date_trunc('day', "visitedAt") AS day, COUNT(*)::bigint AS total
      FROM "Visit" WHERE "visitedAt" >= ${since}
      GROUP BY 1 ORDER BY 1 ASC`,
  ]);

  const pointIds = byPoint.map((p) => p.pointId);
  const topGuides = pointIds.length
    ? await prisma.pointOfInterest.findMany({
        where: { id: { in: pointIds } },
        select: { id: true, name: true, category: true },
      })
    : [];

  const names = new Map(topGuides.map((p) => [p.id, p]));
  const max = Math.max(1, ...byPoint.map((p) => p._count._all));

  const sourceLabels: Record<string, string> = {
    MAP: "Desde el mapa",
    QR: "Desde un QR",
    ROUTE: "Desde una ruta",
    SEARCH: "Desde una búsqueda",
    SHARE: "Desde un enlace compartido",
  };

  return (
    <div>
      <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--color-ink)]">
        Analíticas de visitas
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-[var(--field-soft)]">
        Ventana de los últimos 30 días. Las visitas se registran cuando alguien
        abre un punto desde el mapa, desde una ruta o desde un QR de la
        señalética.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <section>
          <h3 className="display text-[1.3rem] text-[var(--color-ink)]">
            Puntos más visitados
          </h3>
          {byPoint.length === 0 ? (
            <p className="mt-4 border border-dashed border-[var(--rule-strong)] p-6 text-center text-[0.9rem] text-[var(--field-soft)]">
              Todavía no se registraron visitas en este período.
            </p>
          ) : (
            <ul className="mt-5 space-y-4">
              {byPoint.map((row) => {
                const point = names.get(row.pointId);
                return (
                  <li key={row.pointId}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-[0.95rem] text-[var(--color-ink)]">
                        {point?.name ?? "Punto eliminado"}
                        {point && (
                          <span className="measure ml-2 text-[0.68rem] text-[var(--field-soft)]">
                            {CATEGORY_LABEL[point.category]}
                          </span>
                        )}
                      </span>
                      <span className="measure text-[0.78rem] text-[var(--color-rust)]">
                        {row._count._all}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full bg-[var(--color-ink)]/12">
                      <div
                        className="h-full bg-[var(--color-rust)]"
                        style={{ width: `${(row._count._all / max) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="space-y-10">
          <div>
            <h3 className="display text-[1.3rem] text-[var(--color-ink)]">
              De dónde vienen las visitas
            </h3>
            <dl className="mt-5 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
              {bySource.map((row) => (
                <div key={row.source} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-[0.95rem] text-[var(--color-ink)]">
                    {sourceLabels[row.source] ?? row.source}
                  </dt>
                  <dd className="measure text-[0.9rem] text-[var(--color-rust)]">
                    {row._count._all}
                  </dd>
                </div>
              ))}
              {bySource.length === 0 && (
                <p className="py-4 text-[0.9rem] text-[var(--field-soft)]">
                  Sin datos de origen todavía.
                </p>
              )}
            </dl>
          </div>

          <div>
            <h3 className="display text-[1.3rem] text-[var(--color-ink)]">
              Visitas por día
            </h3>
            <p className="measure mt-4 text-[0.78rem] text-[var(--field-soft)]">
              {visits} visitas en los últimos 30 días
            </p>
            <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto border-y border-[var(--rule)] py-3">
              {daily.map((row) => (
                <li key={row.day.toISOString()} className="flex items-baseline justify-between gap-4">
                  <span className="text-[0.88rem] text-[var(--color-ink)]">
                    {formatDate(row.day)}
                  </span>
                  <span className="measure text-[0.8rem] text-[var(--color-rust)]">
                    {Number(row.total)}
                  </span>
                </li>
              ))}
              {daily.length === 0 && (
                <li className="py-3 text-[0.9rem] text-[var(--field-soft)]">
                  Todavía no hay visitas registradas.
                </li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
