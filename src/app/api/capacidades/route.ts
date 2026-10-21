import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  kind: z.enum(["TEXT", "AUDIO", "VIDEO"]),
  title: z.string().min(3, "Poné un título").max(120),
  body: z.string().max(4000).optional().default(""),
  audioUrl: z.string().max(500).optional(),
  videoUrl: z.string().max(500).optional(),
  language: z.enum(["ES", "GN", "EN"]).default("ES"),
  duration: z.number().int().min(0).max(7200).optional(),
  pointId: z.string().optional(),
});

/** Una guia envia una capsula; queda pendiente de moderacion. */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Iniciá sesión para enviar una cápsula" },
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
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (data.kind === "AUDIO" && !data.audioUrl) {
    return NextResponse.json(
      { error: "Falta el archivo de audio" },
      { status: 400 },
    );
  }
  if (data.kind === "VIDEO" && !data.videoUrl) {
    return NextResponse.json(
      { error: "Falta el archivo de video" },
      { status: 400 },
    );
  }

  const submission = await prisma.contentSubmission.create({
    data: {
      kind: data.kind,
      title: data.title,
      body: data.body || null,
      audioUrl: data.audioUrl || null,
      videoUrl: data.videoUrl || null,
      language: data.language,
      duration: data.duration ?? null,
      authorId: session.user.id,
    },
    select: { id: true, status: true, createdAt: true },
  });

  return NextResponse.json(submission, { status: 201 });
}
