import { prisma } from "@/lib/prisma";
import { RouteForm } from "@/components/admin/route-form";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { formatDistance, formatDuration } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminRoutesPage() {
  const [routes, points] = await Promise.all([
    prisma.route.findMany({
      orderBy: { name: "asc" },
      include: { stops: { orderBy: { order: "asc" }, include: { point: { select: { slug: true } } } } },
    }),
    prisma.pointOfInterest.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const pointSlugs = points.map((p) => p.slug);

  return (
    <div>
      <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--field)]">
        Rutas
      </h2>

      <div className="mt-6">
        <RouteForm pointSlugs={pointSlugs} />
      </div>

      <ul className="mt-10 divide-y divide-[var(--rule)] border-t-2 border-[var(--color-ink)]">
        {routes.map((route) => (
          <li key={route.id} className="py-5">
            <p className="display text-[1.25rem] text-[var(--field)]">{route.name}</p>
            <p className="measure mt-1 text-[0.72rem] text-[var(--field-soft)]">
              {route.slug} · {route.theme ?? "—"} ·{" "}
              {route.difficulty ? DIFFICULTY_LABEL[route.difficulty] : "—"} ·{" "}
              {formatDistance(route.distance)} · {formatDuration(route.duration)}
            </p>
            <p className="measure mt-1.5 text-[0.68rem] text-[var(--field-soft)]">
              {route.stops.map((s) => s.point.slug).join(" → ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
