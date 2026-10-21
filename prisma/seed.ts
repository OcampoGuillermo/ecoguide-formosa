/**
 * Seed de EcoGuide Formosa.
 *
 * Idempotente: se puede volver a correr sin duplicar nada.
 * Usa el mismo cliente Prisma + adapter Neon que la app.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import { ADMIN, GUIDES, POINTS, ROUTES } from "./data/content";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL no esta definida.");
}

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(ADMIN.password, 10);
  const user = await prisma.user.upsert({
    where: { email: ADMIN.email },
    update: { name: ADMIN.name, role: "ADMIN", passwordHash },
    create: {
      email: ADMIN.email,
      name: ADMIN.name,
      role: "ADMIN",
      passwordHash,
    },
  });
  console.log("admin:", user.email);
  return user;
}

async function seedGuides(adminId: string) {
  const ids: Record<string, string> = {};
  for (const guide of GUIDES) {
    const passwordHash = await bcrypt.hash("ecoguide-guia-2026", 10);
    const user = await prisma.user.upsert({
      where: { email: guide.email },
      update: {
        name: guide.name,
        role: "GUIDE",
        passwordHash,
        profile: {
          upsert: {
            create: {
              bio: guide.bio,
              phone: guide.whatsapp,
              whatsapp: guide.whatsapp,
              instagram: guide.instagram,
              region: guide.region,
              languages: guide.languages,
              specialties: guide.specialties,
              isVerified: guide.isVerified,
              verifiedAt: guide.isVerified ? new Date() : null,
            },
            update: {
              bio: guide.bio,
              whatsapp: guide.whatsapp,
              instagram: guide.instagram,
              region: guide.region,
              languages: guide.languages,
              specialties: guide.specialties,
              isVerified: guide.isVerified,
              verifiedAt: guide.isVerified ? new Date() : null,
            },
          },
        },
      },
      create: {
        email: guide.email,
        name: guide.name,
        role: "GUIDE",
        passwordHash,
        profile: {
          create: {
            bio: guide.bio,
            phone: guide.whatsapp,
            whatsapp: guide.whatsapp,
            instagram: guide.instagram,
            region: guide.region,
            languages: guide.languages,
            specialties: guide.specialties,
            isVerified: guide.isVerified,
            verifiedAt: guide.isVerified ? new Date() : null,
          },
        },
      },
    });
    ids[guide.email] = user.id;
  }
  void adminId;
  console.log("guias:", Object.keys(ids).length);
  return ids;
}

async function seedPoints(guideIds: Record<string, string>) {
  const guideIdsList = Object.values(guideIds);
  let audioCount = 0;
  let videoCount = 0;

  for (const point of POINTS) {
    const author = guideIdsList[POINTS.indexOf(point) % guideIdsList.length];

    const created = await prisma.pointOfInterest.upsert({
      where: { slug: point.slug },
      update: {
        name: point.name,
        description: point.description,
        shortDesc: point.shortDesc,
        latitude: point.latitude,
        longitude: point.longitude,
        altitude: point.altitude,
        address: point.address,
        region: point.region,
        category: point.category,
        tags: point.tags,
        qrCode: point.qrCode,
        status: "PUBLISHED",
        publishedAt: new Date(),
        createdById: author,
      },
      create: {
        slug: point.slug,
        name: point.name,
        description: point.description,
        shortDesc: point.shortDesc,
        latitude: point.latitude,
        longitude: point.longitude,
        altitude: point.altitude,
        address: point.address,
        region: point.region,
        category: point.category,
        tags: point.tags,
        qrCode: point.qrCode,
        status: "PUBLISHED",
        publishedAt: new Date(),
        createdById: author,
      },
    });

    // Audioguías: se reemplazan por completo para que el seed sea reproducible.
    await prisma.audioGuide.deleteMany({ where: { pointId: created.id } });
    for (const [index, audio] of point.audio.entries()) {
      await prisma.audioGuide.create({
        data: {
          pointId: created.id,
          language: audio.language,
          title: audio.title,
          script: audio.script,
          audioUrl: `/media/audio/${point.slug}-${audio.language}.mp3`,
          duration: 0,
          voice: "tts",
          narratorId: author,
          order: index,
        },
      });
      audioCount++;
    }

    await prisma.videoContent.deleteMany({ where: { pointId: created.id } });
    await prisma.videoContent.create({
      data: {
        pointId: created.id,
        title: point.video.title,
        description: point.video.description,
        videoUrl: `/media/video/${point.slug}.mp4`,
        thumbnailUrl: `/media/video/${point.slug}.jpg`,
        duration: point.video.duration,
        format: "vertical",
        order: 0,
      },
    });
    videoCount++;
  }

  console.log("puntos:", POINTS.length, "| audioguias:", audioCount, "| clips:", videoCount);
}

async function seedRoutes(guideIds: Record<string, string>) {
  const guideIdsList = Object.values(guideIds);
  for (const [index, route] of ROUTES.entries()) {
    const author = guideIdsList[index % guideIdsList.length];
    const created = await prisma.route.upsert({
      where: { slug: route.slug },
      update: {
        name: route.name,
        description: route.description,
        distance: route.distance,
        duration: route.duration,
        difficulty: route.difficulty,
        theme: route.theme,
        isPublic: true,
        createdById: author,
      },
      create: {
        slug: route.slug,
        name: route.name,
        description: route.description,
        distance: route.distance,
        duration: route.duration,
        difficulty: route.difficulty,
        theme: route.theme,
        isPublic: true,
        createdById: author,
      },
    });

    await prisma.routePoint.deleteMany({ where: { routeId: created.id } });
    for (const [order, stop] of route.stops.entries()) {
      const point = await prisma.pointOfInterest.findUnique({
        where: { slug: stop.slug },
      });
      if (!point) continue;
      await prisma.routePoint.create({
        data: { routeId: created.id, pointId: point.id, order, notes: stop.notes },
      });
    }
  }
  console.log("rutas:", ROUTES.length);
}

async function main() {
  const admin = await seedAdmin();
  const guideIds = await seedGuides(admin.id);
  await seedPoints(guideIds);
  await seedRoutes(guideIds);

  // Duracion real de las pistas de audio, medida sobre el archivo generado.
  await syncAudioDurations();

  console.log("seed completo");
}

async function syncAudioDurations() {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const run = promisify(execFile);
  const path = await import("node:path");
  const fs = await import("node:fs/promises");

  const root = path.resolve(process.cwd());
  const guides = await prisma.audioGuide.findMany();

  for (const guide of guides) {
    const rel = guide.audioUrl.replace(/^\//, "");
    const abs = path.join(root, "public", rel);
    try {
      await fs.access(abs);
      const { stdout } = await run("ffprobe", [
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=nw=1:nk=1",
        abs,
      ]);
      const seconds = Math.round(parseFloat(stdout.trim()));
      if (Number.isFinite(seconds) && seconds > 0) {
        await prisma.audioGuide.update({
          where: { id: guide.id },
          data: { duration: seconds },
        });
      }
    } catch {
      /* la pista no esta generada todavia: queda en 0 */
    }
  }

  // Duracion real de los clips verticales.
  const clips = await prisma.videoContent.findMany();
  for (const clip of clips) {
    const abs = path.join(root, "public", clip.videoUrl.replace(/^\//, ""));
    try {
      await fs.access(abs);
      const { stdout } = await run("ffprobe", [
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=nw=1:nk=1",
        abs,
      ]);
      const seconds = Math.round(parseFloat(stdout.trim()));
      if (Number.isFinite(seconds) && seconds > 0) {
        await prisma.videoContent.update({
          where: { id: clip.id },
          data: { duration: seconds },
        });
      }
    } catch {
      /* el clip no esta generado todavia */
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
