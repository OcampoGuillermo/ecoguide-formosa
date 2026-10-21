import type { ReactNode } from "react";

export function PageHeader({
  title,
  lead,
  aside,
}: {
  title: string;
  lead?: string;
  aside?: ReactNode;
}) {
  return (
    <header className="border-b-2 border-[var(--color-ink)] pb-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="display text-[clamp(2.25rem,6vw,4.5rem)] text-[var(--field)]">
            {title}
          </h1>
          {lead && (
            <p className="measure-wide mt-5 leading-relaxed text-[var(--field-soft)]">
              {lead}
            </p>
          )}
        </div>
        {aside}
      </div>
    </header>
  );
}
