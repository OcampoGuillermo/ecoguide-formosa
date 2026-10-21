"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("El correo o la contraseña no coinciden.");
      setLoading(false);
      return;
    }

    toast.success("Sesión iniciada.");
    const callback = params.get("callbackUrl");
    router.push(callback && callback.startsWith("/") ? callback : "/mis-capsulas");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="plate p-6" noValidate>
      <div>
        <label htmlFor="email" className="label text-[var(--field-soft)]">
          Correo
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field mt-2"
          placeholder="nombre@correo.com"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="password" className="label text-[var(--field-soft)]">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field mt-2"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 border-l-2 border-[var(--color-rust)] bg-[var(--color-rust)]/10 px-3 py-2 text-[0.9rem] text-[var(--color-ink)]"
        >
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary mt-6 w-full">
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        Ingresar
      </button>

      <p className="mt-5 text-[0.88rem] text-[var(--field-soft)]">
        ¿Todavía no tenés cuenta?{" "}
        <Link
          href="/registrarse"
          className="font-semibold text-[var(--color-ink)] underline decoration-[var(--color-rust)] decoration-2 underline-offset-4"
        >
          Registrate
        </Link>
        .
      </p>
    </form>
  );
}
