import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const highlightRouter = createTRPCRouter({
  
  getMany: privateProcedure
    .input(z.object({ activityDataId: z.string() }))
    .query( async ({ input, ctx }) => {
      return await ctx.db.highlight.findMany({
        where: {activityDataId: input.activityDataId},
      });
    }),
  create: privateProcedure
    .input(z.object({ activityDataId: z.string(), rects: z.string(), content: z.string(), fileId: z.string() }))
    .mutation( async ({ input, ctx }) => {
      return await ctx.db.highlight.create({
        data: {
          activityDataId: input.activityDataId,
          rects: input.rects,
          content: input.content,
          fileId: input.fileId,
        }
      });
    }),
})