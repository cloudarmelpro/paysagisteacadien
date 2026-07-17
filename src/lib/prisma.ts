import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Le cache global est requis en développement : sans lui, chaque rechargement
 * de module ouvre un pool de connexions supplémentaire jusqu'à épuisement.
 * Prisma 7 impose un driver adapter ; `DATABASE_URL` doit être l'URL poolée.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  // Sans cette garde, pg retombe silencieusement sur localhost:5432 : la panne
  // n'apparaîtrait qu'au premier envoi de formulaire, côté visiteur.
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL est absent. Définir l'URL poolée Neon dans l'environnement (voir .env.example).",
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
