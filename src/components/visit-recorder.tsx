"use client";

import { useEffect, useRef } from "react";
import type { VisitSource } from "@/generated/prisma/enums";

/**
 * Registra la visita al punto para las analiticas del panel.
 * Silencioso: si falla (sin red, por ejemplo) no interrumpe la lectura.
 */
export function VisitRecorder({
  pointId,
  source = "MAP",
}: {
  pointId: string;
  source?: VisitSource;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    fetch("/api/visitas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pointId, source }),
      signal: controller.signal,
      keepalive: true,
    })
      .catch(() => undefined)
      .finally(() => clearTimeout(timeout));
  }, [pointId, source]);

  return null;
}
