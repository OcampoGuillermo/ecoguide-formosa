import Image from "next/image";
import Link from "next/link";
import { FOOTER_NAV, SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/icons/icon-192x192.png"
                alt=""
                width={44}
                height={44}
                className="rounded-full"
              />
              <span className="leading-none">
                <span className="display block text-[1.5rem]">{SITE.wordmark}</span>
                <span className="label block text-[0.6rem] text-[var(--color-sunset)]">
                  {SITE.region}
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-[var(--color-paper)]/70">
              {SITE.description}
            </p>
            <p className="label mt-6 text-[var(--color-turq)]">{SITE.tagline}</p>
          </div>

          {FOOTER_NAV.map((group) => (
            <nav key={group.title} className="md:col-span-2">
              <h2 className="label text-[var(--color-sunset)]">{group.title}</h2>
              <ul className="mt-4 space-y-2.5 text-[0.95rem]">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[var(--color-paper)]/75 underline-offset-4 transition-colors duration-150 hover:text-[var(--color-paper)] hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-1" aria-hidden="true" />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--color-paper)]/20 pt-6 text-[0.8rem] text-[var(--color-paper)]/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EcoGuide Formosa · Provincia de Formosa</p>
          <p className="measure">
            Contenido de la comunidad · moderado antes de publicar
          </p>
        </div>
      </div>
    </footer>
  );
}
