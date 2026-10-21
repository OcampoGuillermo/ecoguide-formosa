import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Ingresá a EcoGuide Formosa para guardar rutas y publicar tus cápsulas.",
};

export default function IngresarPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="display text-[clamp(2.25rem,6vw,3.5rem)] text-[var(--field)]">
        Ingresar
      </h1>
      <p className="mt-5 leading-relaxed text-[var(--field-soft)]">
        Con tu cuenta guardás el avance de las rutas, tus puntos favoritos y
        mandás tus cápsulas a moderación.
      </p>
      <div className="mt-9">
        <Suspense
          fallback={<div className="plate h-80 animate-pulse" aria-hidden="true" />}
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
