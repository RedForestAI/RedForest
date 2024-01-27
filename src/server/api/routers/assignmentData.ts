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
    
  getMany: privateProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Find
      return await ctx.db.assignmentData.findMany({
        where: { studentId: input.studentId },
      });
    }),

  create: privateProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        studentId: z.string(),
        totalActs: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Create
      return await ctx.db.assignmentData.create({
        data: {
          assignmentId: input.assignmentId,
          studentId: input.studentId,
          totalActs: input.totalActs,
        },
      });
    }),

  markAsComplete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Get all ActivityData for assignmentData
      const activityData = await ctx.db.activityData.findMany({
        where: { assignmentDataId: input.id },
      });

      // Compute the score through a sum
      const score = activityData.reduce((acc, curr) => {
        return acc + curr.score;
      }, 0);
      
      // Update
      return await ctx.db.assignmentData.update({
        where: { id: input.id },
        data: { completed: true, completedAt: new Date(), score: score },
      });
    }),
});
