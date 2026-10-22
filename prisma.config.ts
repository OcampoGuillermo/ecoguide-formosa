// Prisma 7 + Neon: el datasource se resuelve por driver adapter en runtime,
// y la CLI usa prisma.config.ts para migraciones.
// Prisma 7 ya no carga .env por su cuenta: lo hacemos aqui.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Tolerante a proposito: `prisma generate` corre en el build de la
    // plataforma y no deberia fallar porque falte la variable. Los comandos
    // que si la necesitan (db push, migrate) fallan con un mensaje claro.
    url: process.env.DATABASE_URL ?? "",
  },
});
