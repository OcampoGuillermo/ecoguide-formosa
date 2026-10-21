"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("ecoguide-theme", next ? "dark" : "light");
    } catch {
      /* almacenamiento no disponible: el tema queda solo para esta sesión */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="p-2 text-[var(--field-soft)] transition-colors duration-150 hover:text-[var(--color-rust)]"
      aria-label={mounted && dark ? "Usar papel claro" : "Usar papel oscuro"}
      title={mounted && dark ? "Papel claro" : "Papel oscuro"}
    >
      {mounted && dark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
