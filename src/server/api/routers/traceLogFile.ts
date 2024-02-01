import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc"

export const traceLogFileRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        activityDataId: z.string(),
        filepath: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.traceLogFile.create({
        data: {
          activityDataId: input.activityDataId,
          filepath: input.filepath
        }
      })
    })
})