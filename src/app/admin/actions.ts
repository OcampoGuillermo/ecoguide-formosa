"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Language, PointCategory } from "@/generated/prisma/enums";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("No autorizado");
  }
  return session.user;
}

const pointSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(3)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  name: z.string().min(3).max(120),
  shortDesc: z.string().max(300).optional(),
  description: z.string().min(10),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  altitude: z.coerce.number().min(-500).max(9000).optional(),
  address: z.string().max(200).optional(),
  region: z.string().max(80).optional(),
  category: z.enum([
    "RESERVA_NATURAL",
    "PARQUE_NACIONAL",
    "RIO",
    "LAGUNA",
    "MONUMENTO",
    "CULTURA",
    "SENDERISMO",
    "COMUNIDAD",
  ]),
  tags: z.string().optional(),
  qrCode: z.string().max(40).optional(),
});

export async function savePoint(formData: FormData) {
  const admin = await requireAdmin();

  const parsed = pointSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    name: formData.get("name"),
    shortDesc: formData.get("shortDesc") || undefined,
    description: formData.get("description"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    altitude: formData.get("altitude") || undefined,
    address: formData.get("address") || undefined,
    region: formData.get("region") || undefined,
    category: formData.get("category"),
    tags: formData.get("tags") || "",
    qrCode: formData.get("qrCode") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    };
  }

  const data = parsed.data;
  const tags = (data.tags ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  try {
    if (data.id) {
      await prisma.pointOfInterest.update({
        where: { id: data.id },
        data: {
          slug: data.slug,
          name: data.name,
          shortDesc: data.shortDesc ?? null,
          description: data.description,
          latitude: data.latitude,
          longitude: data.longitude,
          altitude: data.altitude ?? null,
          address: data.address ?? null,
          region: data.region ?? null,
          category: data.category as PointCategory,
          tags,
          qrCode: data.qrCode || null,
        },
      });
    } else {
      await prisma.pointOfInterest.create({
        data: {
          slug: data.slug,
          name: data.name,
          shortDesc: data.shortDesc ?? null,
          description: data.description,
          latitude: data.latitude,
          longitude: data.longitude,
          altitude: data.altitude ?? null,
          address: data.address ?? null,
          region: data.region ?? null,
          category: data.category as PointCategory,
          tags,
          qrCode: data.qrCode || null,
          status: "PUBLISHED",
          publishedAt: new Date(),
          createdById: admin.id,
        },
      });
    }
  } catch {
    return { ok: false as const, error: "No se pudo guardar: revisá el slug y el código QR." };
  }

  revalidatePath("/admin/puntos");
  revalidatePath("/mapa");
  revalidatePath("/");
  return { ok: true as const };
}

const routeSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/),
  name: z.string().min(3).max(120),
  description: z.string().max(1000).optional(),
  distance: z.coerce.number().min(0).max(500).optional(),
  duration: z.coerce.number().int().min(0).max(1440).optional(),
  difficulty: z.enum(["FACIL", "MEDIO", "DIFICIL"]).optional(),
  theme: z.string().max(40).optional(),
});

export async function saveRoute(formData: FormData) {
  const admin = await requireAdmin();

  const parsed = routeSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    distance: formData.get("distance") || undefined,
    duration: formData.get("duration") || undefined,
    difficulty: formData.get("difficulty") || undefined,
    theme: formData.get("theme") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    };
  }

  const data = parsed.data;
  const stops = String(formData.get("stops") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const route = data.id
      ? await prisma.route.update({
          where: { id: data.id },
          data: {
            slug: data.slug,
            name: data.name,
            description: data.description ?? null,
            distance: data.distance ?? null,
            duration: data.duration ?? null,
            difficulty: data.difficulty ?? null,
            theme: data.theme ?? null,
          },
        })
      : await prisma.route.create({
          data: {
            slug: data.slug,
            name: data.name,
            description: data.description ?? null,
            distance: data.distance ?? null,
            duration: data.duration ?? null,
            difficulty: data.difficulty ?? null,
            theme: data.theme ?? null,
            isPublic: true,
            createdById: admin.id,
          },
        });

    if (stops.length) {
      await prisma.routePoint.deleteMany({ where: { routeId: route.id } });
      const points = await prisma.pointOfInterest.findMany({
        where: { slug: { in: stops } },
        select: { id: true, slug: true },
      });
      const order = new Map(points.map((p) => [p.slug, p.id]));
      let position = 0;
      for (const slug of stops) {
        const pointId = order.get(slug);
        if (!pointId) continue;
        await prisma.routePoint.create({
          data: { routeId: route.id, pointId, order: position++ },
        });
      }
    }
  } catch {
    return { ok: false as const, error: "No se pudo guardar la ruta." };
  }

  revalidatePath("/admin/rutas");
  revalidatePath("/rutas");
  return { ok: true as const };
}

export async function reviewSubmission(
  id: string,
  decision: "APPROVED" | "REJECTED",
  note?: string,
) {
  const admin = await requireAdmin();

  await prisma.contentSubmission.update({
    where: { id },
    data: {
      status: decision,
      reviewNote: note?.trim() || null,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin/moderacion");
  revalidatePath("/mis-capsulas");
  return { ok: true as const };
}

export async function setUserRole(userId: string, role: "TOURIST" | "GUIDE" | "ADMIN") {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/usuarios");
  return { ok: true as const };
}

export async function setGuideVerified(userId: string, verified: boolean) {
  await requireAdmin();
  await prisma.guideProfile.updateMany({
    where: { userId },
    data: { isVerified: verified, verifiedAt: verified ? new Date() : null },
  });
  revalidatePath("/admin/usuarios");
  revalidatePath("/guias");
  return { ok: true as const };
}

export async function setPointStatus(pointId: string, status: "PUBLISHED" | "ARCHIVED") {
  await requireAdmin();
  await prisma.pointOfInterest.update({
    where: { id: pointId },
    data: { status, publishedAt: status === "PUBLISHED" ? new Date() : undefined },
  });
  revalidatePath("/admin/puntos");
  revalidatePath("/mapa");
  return { ok: true as const };
}

export async function addAudioGuide(
  pointId: string,
  language: Language,
  title: string,
  script: string,
  audioUrl: string,
  duration: number,
) {
  await requireAdmin();
  await prisma.audioGuide.create({
    data: {
      pointId,
      language,
      title,
      script,
      audioUrl,
      duration,
      voice: "human",
    },
  });
  revalidatePath("/admin/puntos");
  return { ok: true as const };
}
