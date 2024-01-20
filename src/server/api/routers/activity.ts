import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const activityRouter = createTRPCRouter({
  getMany: privateProcedure
    .input(z.object({ assignmentId: z.string()}))
    .query( async ({ input, ctx }) => {
        // Get assignments pertaining to course
        return await ctx.db.activity.findMany({
          where: {assignmentId: input.assignmentId},
        });
    }),

  getOne: privateProcedure
    .input(z.object({ id: z.string() }))
    .query( async ({ input, ctx }) => {
        // Get assignments pertaining to course
        return await ctx.db.activity.findUnique({
          where: {id: input.id},
        });
    })
})