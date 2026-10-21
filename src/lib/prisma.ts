import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Cliente Prisma sobre Neon (Postgres serverless).
 * El pooler de Neon corta conexiones inactivas: en entornos de larga duración
 * (dev server) reintentamos una vez ante un fallo de conexion.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  adapter: PrismaNeon | undefined;
};

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL no esta definida. Copia .env.example a .env y completa la conexion.",
    );
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
