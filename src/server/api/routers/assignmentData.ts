import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const assignmentDataRouter = createTRPCRouter({
  getOne: privateProcedure
    .input(z.object({ assignmentId: z.string(), studentId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Find
      return await ctx.db.assignmentData.findFirst({
        where: {
          assignmentId: input.assignmentId,
          studentId: input.studentId,
        },
      });
    }),

  create: privateProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        studentId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Create
      return await ctx.db.assignmentData.create({
        data: {
          assignmentId: input.assignmentId,
          studentId: input.studentId,
        },
      });
    }),
});
