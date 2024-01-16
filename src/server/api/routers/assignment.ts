import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const assignmentRouter = createTRPCRouter({
  get: privateProcedure
    .input(z.object({ courseId: z.string()}))
    .query( async ({ input, ctx }) => {

      // Get assignments pertaining to course
      return await ctx.db.assignment.findMany({
        where: {courseId: input.courseId},
      });

    })
});