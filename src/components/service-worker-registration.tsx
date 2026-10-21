"use client";

import { useEffect } from "react";

/** Registra el service worker y avisa cuando la app queda disponible sin red. */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        /* el registro falla en desarrollo con http en otro host: no es critico */
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
