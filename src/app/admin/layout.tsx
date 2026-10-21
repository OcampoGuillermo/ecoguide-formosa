import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NAV } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

const TABS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/puntos", label: "Puntos" },
  { href: "/admin/rutas", label: "Rutas" },
  { href: "/admin/moderacion", label: "Moderación" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/analiticas", label: "Analíticas" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/ingresar?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-[var(--color-ink)] pb-6">
        <div>
          <h1 className="display text-[clamp(2rem,5vw,3.25rem)] text-[var(--color-ink)]">
            Panel
          </h1>
        </div>
        <Link href="/" className="label text-[var(--field-soft)] hover:text-[var(--color-ink)]">
          Volver al sitio
        </Link>
      </div>

      <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-[var(--rule)] pb-4">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="label text-[var(--field-soft)] transition-colors duration-150 hover:text-[var(--color-ink)]"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="mt-9">{children}</div>
    </div>
  );
}

export const adminNav = NAV;
