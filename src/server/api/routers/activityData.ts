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

  markAsComplete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // First check that length of answers is equal to length of questions
      const activityData = await ctx.db.activityData.findUniqueOrThrow({
        where: { id: input.id },
      });

      const activity = await ctx.db.activity.findUniqueOrThrow({
        where: { id: activityData.activityId },
      });

      const questions = await ctx.db.question.findMany({
        where: { activityId: activity.id },
      });

      if (questions.length !== activityData.answers.length) {
        throw new Error("Activity is not complete");
      }

      // Compute the score, first sort the questions by index
      const sortedQuestions = questions.sort((a, b) => a.index - b.index);

      // Then compute the score
      const score = sortedQuestions.reduce((acc, question, index) => {
        const answer = activityData.answers[index];
        return acc + (question.answer === answer ? question.pts : 0);
      }, 0);

      return await ctx.db.activityData.update({
        where: { id: input.id },
        data: { completed: true, completedAt: new Date(), score: score},
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