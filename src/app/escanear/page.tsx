import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ScannerClient } from "@/components/scanner-client";

export const metadata: Metadata = {
  title: "Escanear la señalética",
  description:
    "Escaneá el código QR de la señalética de los senderos de Formosa y abrí la ficha, la audioguía y el clip del lugar.",
};

export default function EscanearPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        title="Escanear la señalética"
        lead="Los carteles de los senderos llevan un código. Apuntá la cámara y la ficha del lugar se abre sola, con su audioguía y su clip, aunque no tengas datos."
      />
      <div className="mt-10">
        <ScannerClient />
      </div>
    </div>
  );
}
