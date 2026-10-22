"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, QrCode, X, UserRound, LogOut, ShieldCheck } from "lucide-react";
import { NAV, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40">
      <div className="h-1.5 w-full bg-[var(--color-ink)]" />
      <div className="border-b border-[var(--rule)] bg-[var(--sheet)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform duration-150 active:scale-[0.98]"
            aria-label="EcoGuide Formosa — inicio"
          >
            <Image
              src="/icons/icon-192x192.png"
              alt=""
              width={38}
              height={38}
              className="rounded-full ring-1 ring-[var(--color-ink)]/25"
              priority
            />
            <span className="leading-none">
              <span className="display block text-[1.5rem] text-[var(--field)]">
                {SITE.wordmark}
              </span>
              <span className="label block text-[0.6875rem] text-[var(--color-rust)]">
                {SITE.region}
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-7 md:flex" aria-label="Principal">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "label relative py-2 transition-colors duration-150",
                  isActive(item.href)
                    ? "text-[var(--field)]"
                    : "text-[var(--field-soft)] hover:text-[var(--field)]",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-[var(--color-rust)] transition-transform duration-200 ease-[var(--ease-out)]",
                    isActive(item.href)
                      ? "scale-x-100"
                      : "scale-x-0 hover:scale-x-100",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Link
              href="/escanear"
              className="hidden items-center gap-2 border border-[var(--color-ink)] px-3 py-2 text-[0.75rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-150 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] sm:inline-flex"
            >
              <QrCode className="size-4" aria-hidden="true" />
              QR
            </Link>

            <ThemeToggle />

            {session?.user ? (
              <div className="hidden items-center gap-2 md:flex">
                {session.user.role === "ADMIN" ? (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 border border-[var(--color-rust)] px-2.5 py-1.5 text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-[var(--color-rust)] transition-colors duration-150 hover:bg-[var(--color-rust)] hover:text-[var(--color-chalk)]"
                    title="Panel de administración"
                  >
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                    {session.user.name ?? "Panel"}
                  </Link>
                ) : (
                  <Link
                    href="/mis-capsulas"
                    className="inline-flex items-center gap-2 px-2 py-2 text-sm font-medium transition-colors duration-150 hover:text-[var(--color-rust)]"
                  >
                    <UserRound className="size-4" aria-hidden="true" />
                    {session.user.name?.split(" ")[0] ?? "Mi cuenta"}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 text-[var(--field-soft)] transition-colors duration-150 hover:text-[var(--color-rust)]"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link
                href="/ingresar"
                className="hidden px-2 py-2 text-sm font-medium transition-colors duration-150 hover:text-[var(--color-rust)] md:block"
              >
                Ingresar
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="p-2 md:hidden"
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              {open ? (
                <X className="size-6" aria-hidden="true" />
              ) : (
                <Menu className="size-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          id="menu-movil"
          className="fixed inset-x-0 top-[4.25rem] bottom-0 z-40 overflow-y-auto border-t border-[var(--rule)] bg-[var(--sheet)] md:hidden"
        >
          <nav className="flex flex-col px-4 py-2" aria-label="Menú móvil">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "display border-b border-[var(--rule)] py-4 text-[2rem]",
                  isActive(item.href)
                    ? "text-[var(--color-rust)]"
                    : "text-[var(--field)]",
                )}
              >
                {item.label}
              </Link>
            ))}
            {session?.user?.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="display border-b border-[var(--rule)] py-4 text-[2rem] text-[var(--color-rust)]"
              >
                Panel de administración
              </Link>
            ) : (
              <Link
                href="/mis-capsulas"
                className="display border-b border-[var(--rule)] py-4 text-[2rem] text-[var(--field)]"
              >
                Mis cápsulas
              </Link>
            )}
            <div className="mt-6 flex flex-col gap-3 pb-8">
              <Link
                href="/escanear"
                className="btn btn-primary w-full"
              >
                <QrCode className="size-4" aria-hidden="true" />
                Escanear señalética
              </Link>
              {session?.user ? (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn btn-ghost w-full"
                >
                  Cerrar sesión
                </button>
              ) : (
                <Link href="/ingresar" className="btn btn-ghost w-full">
                  Ingresar
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
