import type { Metadata } from "next";
import { MapExplorer } from "@/components/map/map-explorer";
import { listPoints, listRegionsInUse } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mapa de la provincia",
  description:
    "Mapa interactivo de las reservas, parques y puntos de interés de Formosa, con coordenadas y ficha de cada lugar.",
};

export default async function MapaPage() {
  const [points, regions] = await Promise.all([
    listPoints(),
    listRegionsInUse(),
  ]);

  return <MapExplorer points={points} regions={regions} />;
}
