import type { Metadata } from "next";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = {
  title: "Registrarse",
  description:
    "Creá tu cuenta en EcoGuide Formosa y, si sos guía o promotor, publicá tus audioguías y tus clips.",
};

export default function RegistrarsePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="display text-[clamp(2.25rem,6vw,3.5rem)] text-[var(--field)]">
        Crear una cuenta
      </h1>
      <p className="mt-5 leading-relaxed text-[var(--field-soft)]">
        La cuenta es gratis y no se pide ningún dato de pago. Si sos guía o
        promotor, tu perfil aparece en la sección de la comunidad.
      </p>
      <div className="mt-9">
        <RegisterForm />
      </div>
    </div>
  );
}
