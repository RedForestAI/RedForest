import { PrismaClient } from "@prisma/client";
import { useSupabaseRowLevelSecurity } from "prisma/useSupabaseRowLevelSecurity";

import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends(useSupabaseRowLevelSecurity());

// @ts-ignore
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
