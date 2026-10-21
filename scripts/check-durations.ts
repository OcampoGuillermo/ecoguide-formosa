import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
  });

  const a = await p.audioGuide.findMany({
    take: 3,
    select: { language: true, duration: true, audioUrl: true },
  });
  const v = await p.videoContent.findMany({
    take: 2,
    select: { duration: true, videoUrl: true, thumbnailUrl: true },
  });
  console.log("audios:", JSON.stringify(a));
  console.log("videos:", JSON.stringify(v));
  await p.$disconnect();
}

main();
