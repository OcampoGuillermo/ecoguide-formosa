import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  pointId: z.string().min(1),
  source: z.enum(["MAP", "QR", "ROUTE", "SEARCH", "SHARE"]).default("MAP"),
  duration: z.number().int().min(0).max(86400).optional(),
});

/** Registra una visita a un punto. Alimenta las analiticas del panel. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const session = await auth();

  const [visit] = await prisma.$transaction([
    prisma.visit.create({
      data: {
        pointId: parsed.data.pointId,
        userId: session?.user?.id ?? null,
        source: parsed.data.source,
        duration: parsed.data.duration,
      },
      select: { id: true },
    }),
    prisma.analyticsEvent.create({
      data: {
        eventType: "point_visit",
        entityId: parsed.data.pointId,
        userId: session?.user?.id ?? null,
        metadata: JSON.stringify({ source: parsed.data.source }),
      },
    }),
  ]);

  return NextResponse.json(visit, { status: 201 });
}
