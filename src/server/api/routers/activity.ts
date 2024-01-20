import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const activityRouter = createTRPCRouter({
  get: privateProcedure
    .input(z.object({ assignmentId: z.string()}))
    .query( async ({ input, ctx }) => {
        // Get assignments pertaining to course
        return await ctx.db.activity.findMany({
          where: {assignmentId: input.assignmentId},
        });
    })
})