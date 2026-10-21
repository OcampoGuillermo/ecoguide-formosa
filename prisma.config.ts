// Prisma 7 + Neon: el datasource se resuelve por driver adapter en runtime,
// y la CLI usa prisma.config.ts para migraciones.
// Prisma 7 ya no carga .env por su cuenta: lo hacemos aqui.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
