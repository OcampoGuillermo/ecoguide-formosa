import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  routeId: z.string().min(1),
  progress: z.number().int().min(0).max(100),
});

/** Guarda el avance de una ruta para el usuario de la sesion. */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Iniciá sesión para guardar el avance" },
      { status: 401 },
    );
  }

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

  const { routeId, progress } = parsed.data;

  const route = await prisma.route.findUnique({
    where: { id: routeId },
    select: { id: true },
  });
  if (!route) {
    return NextResponse.json({ error: "La ruta no existe" }, { status: 404 });
  }

  const run = await prisma.routeVisit.upsert({
    where: { routeId_userId: { routeId, userId: session.user.id } },
    create: {
      routeId,
      userId: session.user.id,
      progress,
      completedAt: progress >= 100 ? new Date() : null,
    },
    update: {
      progress,
      completedAt: progress >= 100 ? new Date() : null,
    },
    select: { progress: true, completedAt: true },
  });

  return NextResponse.json(run);
}
