import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const activityDataRouter = createTRPCRouter({
  getOne: privateProcedure
    .input(z.object({ activityId: z.string(), assignmentDataId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.activityData.findFirst({
        where: {
          activityId: input.activityId,
          assignmentDataId: input.assignmentDataId,
        },
      });
    }),

  appendAnswer: privateProcedure
    .input(z.object({ id: z.string(), answer: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.activityData.update({
        where: { id: input.id },
        data: { 
          answers: { push: input.answer }, 
          answersAt: { push: new Date()},
          currentQuestionId: { increment: 1 } 
        },
      });
    }),

  create: privateProcedure
    .input(
      z.object({
        activityId: z.string(),
        assignmentDataId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.activityData.create({
        data: {
          activityId: input.activityId,
          assignmentDataId: input.assignmentDataId,
        },
      });
    }),
});
