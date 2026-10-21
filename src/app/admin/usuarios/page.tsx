import { prisma } from "@/lib/prisma";
import { UsersClient } from "@/components/admin/users-client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      profile: { select: { isVerified: true, isDemo: true, specialties: true } },
      _count: { select: { points: true } },
    },
  });

  return (
    <UsersClient
      users={users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
        isGuide: Boolean(u.profile),
        isVerified: u.profile?.isVerified ?? false,
        isDemo: u.profile?.isDemo ?? false,
        specialties: u.profile?.specialties ?? [],
        pointsCount: u._count.points,
      }))}
    />
  );
}
