"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QrScanner } from "@/components/qr-scanner";

export function ScannerClient() {
  const router = useRouter();
  const [buscando, setBuscando] = useState(false);

  async function handleDetected(raw: string) {
    setBuscando(true);
    try {
      const res = await fetch(`/api/puntos/resolve?q=${encodeURIComponent(raw)}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No encontramos ese código.");
        setBuscando(false);
        return;
      }
      toast.success(`Abriendo ${data.name}`);
      router.push(`/puntos/${data.slug}`);
    } catch {
      toast.error("Sin conexión: no pudimos verificar el código.");
      setBuscando(false);
    }
  }

  return (
    <>
      <QrScanner onDetected={handleDetected} />
      {buscando && (
        <p className="mt-6 text-[0.9rem] text-[var(--field-soft)]" role="status">
          Buscando el punto…
        </p>
      )}
    </>
  );
}
