import { prisma } from "@/lib/prisma";
import { ModerationClient } from "@/components/admin/moderation-client";

export const dynamic = "force-dynamic";

export default async function AdminModerationPage() {
  const submissions = await prisma.contentSubmission.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { author: { select: { name: true } } },
  });

  return (
    <ModerationClient
      submissions={submissions.map((s) => ({
        id: s.id,
        kind: s.kind,
        status: s.status,
        title: s.title,
        body: s.body,
        audioUrl: s.audioUrl,
        videoUrl: s.videoUrl,
        language: s.language,
        createdAt: s.createdAt.toISOString(),
        author: s.author.name ?? "Guía",
      }))}
    />
  );
}
