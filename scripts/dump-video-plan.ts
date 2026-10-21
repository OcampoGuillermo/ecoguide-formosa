/**
 * Vuelca el plan de video del seed a JSON para el generador de clips.
 *   npx tsx scripts/dump-video-plan.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { POINTS } from "../prisma/data/content.js";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..", ".impeccable", "video-plan.json");

const plan = POINTS.map((p) => ({
  slug: p.slug,
  name: p.name,
  region: p.region,
  latitude: p.latitude,
  longitude: p.longitude,
  qr: p.qrCode,
  duration: p.video.duration,
}));

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(plan, null, 2), "utf8");
console.log(`plan de video: ${plan.length} clips -> ${out}`);
