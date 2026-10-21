import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Resuelve un valor escaneado (un codigo de senaletica, un slug o una URL)
 * al punto de interes que corresponde.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = (searchParams.get("q") ?? "").trim();
  if (!raw) {
    return NextResponse.json({ error: "Falta el valor a buscar" }, { status: 400 });
  }

  // Si vino una URL de la app, se toma el ultimo segmento.
  const candidate = raw.includes("/")
    ? raw.split("?")[0].split("/").filter(Boolean).pop() ?? raw
    : raw;

  const point = await prisma.pointOfInterest.findFirst({
    where: {
      status: "PUBLISHED",
      OR: [{ qrCode: candidate }, { slug: candidate }],
    },
    select: { slug: true, name: true, region: true },
  });

  if (!point) {
    return NextResponse.json(
      { error: "Ese código no corresponde a ningún punto publicado." },
      { status: 404 },
    );
  }

  return NextResponse.json(point);
}
