import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Singleton PrismaClient. En développement, Next.js recharge les modules à
 * chaque édition : sans ce cache global, chaque rechargement ouvrirait un
 * nouveau pool de connexions et finirait par les épuiser.
 *
 * Prisma 7 exige un driver adapter : `@prisma/adapter-pg` (node-postgres) se
 * connecte à Neon en TCP via l'URL poolée. La chaîne vient de `DATABASE_URL`.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
