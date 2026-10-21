import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2, "Escribí tu nombre").max(80),
  email: z.string().email("Ingresá un correo válido"),
  password: z.string().min(8, "La contraseña tiene al menos 8 caracteres").max(200),
  region: z.string().max(80).optional().default(""),
  whatsapp: z.string().max(32).optional().default(""),
  asGuide: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
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

  const { name, email, password, region, whatsapp, asGuide } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Ya existe una cuenta con ese correo" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: name.trim(),
      passwordHash,
      role: asGuide ? "GUIDE" : "TOURIST",
      ...(asGuide
        ? {
            profile: {
              create: {
                languages: ["ES"],
                specialties: [],
                whatsapp: whatsapp || null,
              },
            },
          }
        : {}),
    },
    select: { id: true, email: true },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
