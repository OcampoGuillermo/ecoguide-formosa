import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Lista de paginas publicas que la app guarda para usar sin conexion.
 * El service worker la consulta despues de activarse y precarga cada ficha.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const [points, routes] = await Promise.all([
    prisma.pointOfInterest.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.route.findMany({
      where: { isPublic: true },
      select: { slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return NextResponse.json({
    urls: [
      ...points.map((point) => `/puntos/${point.slug}`),
      ...routes.map((route) => `/rutas/${route.slug}`),
    ],
  });
}
