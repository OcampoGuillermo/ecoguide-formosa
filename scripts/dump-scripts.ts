/**
 * Vuelca el plan de audio del seed a JSON para que el generador de TTS lo lea.
 *   npx tsx scripts/dump-scripts.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { POINTS } from "../prisma/data/content.js";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..", ".impeccable", "audio-plan.json");

const plan = POINTS.flatMap((p) =>
  p.audio.map((a) => ({
    slug: p.slug,
    language: a.language,
    title: a.title,
    script: a.script,
  })),
);

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(plan, null, 2), "utf8");
console.log(`plan de audio: ${plan.length} pistas -> ${out}`);
