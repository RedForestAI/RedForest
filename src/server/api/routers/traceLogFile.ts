import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc"

export const traceLogFileRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        activityDataId: z.string(),
        activityId: z.string(),
        filepath: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.traceLogFile.create({
        data: {
          activityDataId: input.activityDataId,
          activityId: input.activityId,
          filepath: input.filepath
        }
      })
    }),

  getMany: privateProcedure
    .input(z.object({
      activityId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.traceLogFile.findMany({
        where: {
          activityId: input.activityId
        }
      })
    })
})