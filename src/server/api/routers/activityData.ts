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

  getMany: privateProcedure
    .input(z.object({ activityId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.activityData.findMany({
        where: { activityId: input.activityId },
      });
    }),

  appendAnswer: privateProcedure
    .input(
      z.object({
        activityDataId: z.string(),
        activityId: z.string(),
        index: z.number(),
        answer: z.number(),
        elapsedTime: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Get the question related to the answer to get a score
      const questions = await ctx.db.question.findMany({
        where: { activityId: input.activityId },
      });

      // Get the question that matches the index
      const question = questions.find(
        (question) => question.index === input.index,
      );

      // If the question is not found, throw an error
      if (!question) {
        throw new Error("Question not found");
      }

      // Compute if correct
      const correct = question.answer === input.answer;

      // Compute the current accumulative score
      const activityData = await ctx.db.activityData.findUniqueOrThrow({
        where: { id: input.activityDataId },
      });
      let accumulativeScore = 0;
      for (let i = 0; i < input.index; i++) {
        const question = questions.find((question) => question.index === i);
        if (question) {
          const answer = activityData.answers[i];
          if (answer === question.answer) {
            accumulativeScore += question.pts;
          } else {
            accumulativeScore -= question.pts;
          }
        }
      }
      if (correct) {
        accumulativeScore += question.pts;
      } else {
        accumulativeScore -= question.pts;
      }

      // { index: Number, elapsedTime: Number, correct: Boolean, pts: Number, accumulativeScore: Number }[]
      const jsonData = {
        index: input.index,
        elapsedTime: input.elapsedTime,
        correct: correct,
        pts: question.pts,
        accumulativeScore: accumulativeScore,
      }

      await ctx.db.activityData.update({
        where: { id: input.activityDataId },
        data: {
          answers: { push: input.answer },
          answersAt: { push: new Date() },
          currentQuestionId: { increment: 1 },
          answersTrace: { push: jsonData }
        },
      });

      // Return if correct and how many points
      return { correct: correct, pts: question?.pts, accumulativeScore: accumulativeScore };
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

      if (
        questions.length != 0 &&
        questions.length !== activityData.answers.length
      ) {
        throw new Error("Activity is not complete");
      }

      // Update the currentActivityId of the assignmentData
      const assignmentData = await ctx.db.assignmentData.findUniqueOrThrow({
        where: { id: activityData.assignmentDataId },
      });
      await ctx.db.assignmentData.update({
        where: { id: assignmentData.id },
        data: { currentActId: { increment: 1 } },
      });

      // Compute the score, first sort the questions by index
      const sortedQuestions = questions.sort((a, b) => a.index - b.index);

      // Then compute the score
      const score = sortedQuestions.reduce((acc, question, index) => {
        const answer = activityData.answers[index];
        return acc + (question.answer === answer ? question.pts : 0);
      }, 0);

      return await ctx.db.activityData.update({
        where: { id: input.id },
        data: { completed: true, completedAt: new Date(), score: score },
      });
    }),

  create: privateProcedure
    .input(
      z.object({
        activityId: z.string(),
        assignmentDataId: z.string(),
        profileId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.activityData.create({
        data: {
          activityId: input.activityId,
          assignmentDataId: input.assignmentDataId,
          profileId: input.profileId,
        },
      });
    }),
});
