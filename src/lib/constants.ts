import type { Language, PointCategory, RouteDifficulty } from "@/generated/prisma/enums";

export const SITE = {
  name: "EcoGuide Formosa",
  wordmark: "EcoGuide",
  region: "FORMOSA",
  tagline: "Turismo Regional & Naturaleza",
  description:
    "Mapa, audioguías y rutas ecoturísticas de la provincia de Formosa. Funciona sin conexión, en el lugar y en el sendero.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

export const NAV = [
  { href: "/mapa", label: "Mapa" },
  { href: "/rutas", label: "Rutas" },
  { href: "/guias", label: "Guías" },
  { href: "/escanear", label: "Escanear" },
] as const;

export const FOOTER_NAV = [
  {
    title: "Explorar",
    links: [
      { href: "/mapa", label: "Mapa interactivo" },
      { href: "/rutas", label: "Rutas temáticas" },
      { href: "/guias", label: "Guías locales" },
      { href: "/escanear", label: "Escanear señalética" },
      { href: "/mis-rutas", label: "Mis rutas" },
    ],
  },
  {
    title: "Comunidad",
    links: [
      { href: "/registrarse", label: "Sumarme como guía" },
      { href: "/mis-capsulas", label: "Mis cápsulas" },
      { href: "/moderacion", label: "Estado de moderación" },
    ],
  },
  {
    title: "El proyecto",
    links: [
      { href: "/sobre", label: "Sobre EcoGuide" },
      { href: "/accesibilidad", label: "Accesibilidad" },
      { href: "/privacidad", label: "Privacidad" },
    ],
  },
] as const;

export const CATEGORY_LABEL: Record<PointCategory, string> = {
  RESERVA_NATURAL: "Reserva natural",
  PARQUE_NACIONAL: "Parque nacional",
  RIO: "Río y arroyo",
  LAGUNA: "Laguna",
  MONUMENTO: "Monumento natural",
  CULTURA: "Cultura",
  SENDERISMO: "Senderismo",
  COMUNIDAD: "Comunidad",
};

export const CATEGORY_COLOR: Record<PointCategory, string> = {
  RESERVA_NATURAL: "var(--color-olive)",
  PARQUE_NACIONAL: "var(--color-turq)",
  RIO: "var(--color-turq-2)",
  LAGUNA: "var(--color-turq)",
  MONUMENTO: "var(--color-sunset)",
  CULTURA: "var(--color-rust)",
  SENDERISMO: "var(--color-olive)",
  COMUNIDAD: "var(--color-ink-3)",
};

export const DIFFICULTY_LABEL: Record<RouteDifficulty, string> = {
  FACIL: "Fácil",
  MEDIO: "Medio",
  DIFICIL: "Difícil",
};

export const LANGUAGE_LABEL: Record<Language, string> = {
  ES: "Español",
  GN: "Guaraní",
  EN: "English",
};

export const LANGUAGE_SHORT: Record<Language, string> = {
  ES: "Español",
  GN: "Guaraní",
  EN: "Inglés",
};

/** Orden de las lenguas en el reproductor: la del usuario primero. */
export const LANGUAGE_ORDER: Language[] = ["ES", "GN", "EN"];

export const REGIONS = [
  "Capital",
  "Bermejo",
  "El Colorado",
  "Matacos",
  "Pilcomayo",
  "Patiño",
  "Ramón Lista",
  "Rivadavia",
  "San Martín",
] as const;
