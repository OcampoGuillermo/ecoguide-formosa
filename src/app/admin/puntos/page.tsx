import { prisma } from "@/lib/prisma";
import { AdminPointsClient } from "@/components/admin/admin-points-client";

export const dynamic = "force-dynamic";

export default async function AdminPointsPage() {
  const points = await prisma.pointOfInterest.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { audioGuides: true, videos: true } } },
  });

  return (
    <AdminPointsClient
      points={points.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        shortDesc: p.shortDesc,
        description: p.description,
        latitude: p.latitude,
        longitude: p.longitude,
        altitude: p.altitude,
        address: p.address,
        region: p.region,
        category: p.category,
        tags: p.tags,
        qrCode: p.qrCode,
        status: p.status,
        audioCount: p._count.audioGuides,
        videoCount: p._count.videos,
      }))}
    />
  );
}
