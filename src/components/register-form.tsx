"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    region: "",
    whatsapp: "",
  });
  const [asGuide, setAsGuide] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, asGuide }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No pudimos crear la cuenta.");
        setLoading(false);
        return;
      }

      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (signInRes?.error) {
        toast.success("Cuenta creada. Ingresá con tu correo.");
        router.push("/ingresar");
        return;
      }

      toast.success("Cuenta creada. Bienvenido a EcoGuide.");
      router.push(asGuide ? "/mis-capsulas" : "/mapa");
      router.refresh();
    } catch {
      setError("Sin conexión: no pudimos crear la cuenta.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="plate p-6" noValidate>
      <div>
        <label htmlFor="name" className="label text-[var(--field-soft)]">
          Nombre y apellido
        </label>
        <input
          id="name"
          required
          autoComplete="name"
          value={form.name}
          onChange={update("name")}
          className="field mt-2"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="reg-email" className="label text-[var(--field-soft)]">
          Correo
        </label>
        <input
          id="reg-email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          className="field mt-2"
          placeholder="nombre@correo.com"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="reg-password" className="label text-[var(--field-soft)]">
          Contraseña
        </label>
        <input
          id="reg-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={form.password}
          onChange={update("password")}
          className="field mt-2"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="region" className="label text-[var(--field-soft)]">
          Departamento donde trabajás
        </label>
        <input
          id="region"
          value={form.region}
          onChange={update("region")}
          className="field mt-2"
          placeholder="Bermejo, Matacos, Pilcomayo…"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="whatsapp" className="label text-[var(--field-soft)]">
          WhatsApp <span className="font-normal normal-case">(opcional)</span>
        </label>
        <input
          id="whatsapp"
          inputMode="tel"
          value={form.whatsapp}
          onChange={update("whatsapp")}
          className="field measure mt-2"
          placeholder="5493700000000"
        />
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 border border-[var(--rule-strong)] p-4">
        <input
          type="checkbox"
          checked={asGuide}
          onChange={(e) => setAsGuide(e.target.checked)}
          className="mt-1 size-4 accent-[var(--color-rust)]"
        />
        <span>
          <span className="block text-[0.95rem] font-semibold text-[var(--color-ink)]">
            Soy guía o promotor turístico
          </span>
          <span className="mt-1 block text-[0.88rem] leading-relaxed text-[var(--field-soft)]">
            Con esto creás un perfil de guía y podés subir audioguías y clips
            para que el equipo los revise antes de publicarlos.
          </span>
        </span>
      </label>

      {error && (
        <p
          role="alert"
          className="alert"
        >
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary mt-6 w-full">
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        Crear la cuenta
      </button>

      <p className="mt-5 text-[0.88rem] text-[var(--field-soft)]">
        ¿Ya tenés cuenta?{" "}
        <Link
          href="/ingresar"
          className="font-semibold text-[var(--color-ink)] underline decoration-[var(--color-rust)] decoration-2 underline-offset-4"
        >
          Ingresá
        </Link>
        .
      </p>
    </form>
  );
}
