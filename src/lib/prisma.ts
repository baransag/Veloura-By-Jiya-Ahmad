import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DEFAULT_DB_URL =
  "postgresql://neondb_owner:npg_eIvo9kHtnD8O@ep-restless-fire-aes7nnkv-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

const dbUrl = process.env.DATABASE_URL || DEFAULT_DB_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
