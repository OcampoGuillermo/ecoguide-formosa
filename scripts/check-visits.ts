import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const p = new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
  });
  const visits = await p.visit.count();
  const events = await p.analyticsEvent.count();
  const last = await p.visit.findMany({
    take: 3,
    select: { source: true, visitedAt: true, point: { select: { name: true } } },
  });
  console.log("visitas:", visits, "| eventos:", events);
  console.log(JSON.stringify(last));
  await p.$disconnect();
}

main();
