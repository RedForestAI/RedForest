import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
  getMany: privateProcedure
    .input(z.object({ activityId: z.string()}))
    .query( async ({ input, ctx }) => {
        // Get assignments pertaining to course
        return await ctx.db.question.findMany({
          where: {activityId: input.activityId},
        });
    })
})