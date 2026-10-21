import "server-only";
import { prisma } from "@/lib/prisma";
import type { Language, PointCategory } from "@/generated/prisma/enums";

export const pointListSelect = {
  id: true,
  slug: true,
  name: true,
  shortDesc: true,
  latitude: true,
  longitude: true,
  altitude: true,
  region: true,
  category: true,
  tags: true,
  coverImage: true,
  qrCode: true,
  audioGuides: {
    select: { id: true, language: true, title: true, duration: true, audioUrl: true, voice: true },
    orderBy: { order: "asc" },
  },
  videos: {
    select: { id: true, title: true, videoUrl: true, thumbnailUrl: true, duration: true },
    where: { isActive: true },
    orderBy: { order: "asc" },
  },
} as const;

export type PointListItem = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string | null;
  latitude: number;
  longitude: number;
  altitude: number | null;
  region: string | null;
  category: PointCategory;
  tags: string[];
  coverImage: string | null;
  qrCode: string | null;
  audioGuides: { id: string; language: Language; title: string; duration: number; audioUrl: string; voice: string | null }[];
  videos: { id: string; title: string; videoUrl: string; thumbnailUrl: string | null; duration: number }[];
};

export async function listPoints(options?: {
  region?: string;
  category?: PointCategory;
  limit?: number;
}) {
  const points = await prisma.pointOfInterest.findMany({
    where: {
      status: "PUBLISHED",
      ...(options?.region ? { region: options.region } : {}),
      ...(options?.category ? { category: options.category } : {}),
    },
    select: pointListSelect,
    orderBy: { name: "asc" },
    ...(options?.limit ? { take: options.limit } : {}),
  });
  return points;
}

export async function getPointBySlug(slug: string) {
  return prisma.pointOfInterest.findUnique({
    where: { slug },
    include: {
      audioGuides: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          narrator: { select: { name: true, image: true, profile: { select: { isVerified: true } } } },
        },
      },
      videos: { where: { isActive: true }, orderBy: { order: "asc" } },
      creator: { select: { id: true, name: true, image: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      routeStops: {
        include: { route: { select: { slug: true, name: true, difficulty: true, distance: true } } },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function listRoutes() {
  return prisma.route.findMany({
    where: { isPublic: true },
    include: {
      stops: {
        orderBy: { order: "asc" },
        include: {
          point: { select: { slug: true, name: true, region: true, latitude: true, longitude: true } },
        },
      },
      creator: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getRouteBySlug(slug: string) {
  return prisma.route.findUnique({
    where: { slug },
    include: {
      stops: {
        orderBy: { order: "asc" },
        include: { point: { select: pointListSelect } },
      },
      creator: { select: { name: true, image: true } },
    },
  });
}

export async function listGuides() {
  return prisma.guideProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          _count: { select: { points: true, narrations: true } },
        },
      },
    },
    orderBy: [{ isVerified: "desc" }, { user: { name: "asc" } }],
  });
}

export async function listStats() {
  const [points, routes, guides, audio, videos] = await Promise.all([
    prisma.pointOfInterest.count({ where: { status: "PUBLISHED" } }),
    prisma.route.count({ where: { isPublic: true } }),
    prisma.guideProfile.count(),
    prisma.audioGuide.count({ where: { isActive: true } }),
    prisma.videoContent.count({ where: { isActive: true } }),
  ]);
  return { points, routes, guides, audio, videos };
}

export async function listRegionsInUse() {
  const rows = await prisma.pointOfInterest.findMany({
    where: { status: "PUBLISHED" },
    select: { region: true },
    distinct: ["region"],
    orderBy: { region: "asc" },
  });
  return rows.map((r) => r.region).filter((r): r is string => Boolean(r));
}
