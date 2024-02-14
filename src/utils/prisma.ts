
import type { Prisma } from "@prisma/client"

export function parsePrisma(json: Prisma.JsonValue) {
  // @ts-ignore
  return JSON.parse(json as string);
}