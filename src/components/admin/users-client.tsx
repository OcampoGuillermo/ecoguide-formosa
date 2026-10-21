"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { setGuideVerified, setUserRole } from "@/app/admin/actions";
import type { UserRole } from "@/generated/prisma/enums";

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: string;
  isGuide: boolean;
  isVerified: boolean;
  isDemo: boolean;
  specialties: string[];
  pointsCount: number;
}

export function UsersClient({ users }: { users: AdminUser[] }) {
  const [pending, startTransition] = useTransition();

  function changeRole(id: string, role: UserRole) {
    startTransition(async () => {
      const result = await setUserRole(id, role);
      if (result.ok) toast.success("Rol actualizado.");
    });
  }

  function toggleVerified(id: string, verified: boolean) {
    startTransition(async () => {
      const result = await setGuideVerified(id, verified);
      if (result.ok) {
        toast.success(verified ? "Guía verificada." : "Verificación quitada.");
      }
    });
  }

  return (
    <div>
      <h2 className="display-wide text-[clamp(1.5rem,3vw,2rem)] text-[var(--color-ink)]">
        Usuarios y guías
      </h2>

      <ul className="mt-8 divide-y divide-[var(--rule)] border-t-2 border-[var(--color-ink)]">
        {users.map((user) => (
          <li key={user.id} className="py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-[1.1rem] font-semibold text-[var(--color-ink)]">
                  {user.name ?? "Sin nombre"}
                  {user.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[0.7rem] font-medium tracking-wide text-[var(--color-turq-2)] uppercase">
                      <CheckCircle2 className="size-3.5" aria-hidden="true" />
                      Verificado
                    </span>
                  )}
                  {user.isDemo && (
                    <span className="stamp text-[var(--color-rust)]">
                      Demostración
                    </span>
                  )}
                </p>
                <p className="measure mt-1 text-[0.72rem] text-[var(--field-soft)]">
                  {user.email} · {user.pointsCount} puntos ·{" "}
                  {new Date(user.createdAt).toLocaleDateString("es-AR")}
                </p>
                {user.specialties.length > 0 && (
                  <p className="measure mt-1 text-[0.7rem] text-[var(--field-soft)]">
                    {user.specialties.join(" · ")}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`role-${user.id}`}>
                  Rol de {user.name ?? user.email}
                </label>
                <select
                  id={`role-${user.id}`}
                  value={user.role}
                  disabled={pending}
                  onChange={(e) => changeRole(user.id, e.target.value as UserRole)}
                  className="field w-auto py-1.5 text-[0.8rem]"
                >
                  <option value="TOURIST">Visitante</option>
                  <option value="GUIDE">Guía</option>
                  <option value="ADMIN">Administración</option>
                </select>

                {user.isGuide && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => toggleVerified(user.id, !user.isVerified)}
                    className="label inline-flex items-center gap-1.5 border border-[var(--rule-strong)] px-3 py-2 transition-colors duration-150 hover:border-[var(--color-ink)]"
                  >
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                    {user.isVerified ? "Quitar verificación" : "Verificar"}
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
