import { QuestionType } from "@prisma/client";
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
    }),

  create: privateProcedure
    .input(z.object({ 
      activityId: z.string(), 
      content: z.string(), 
      index: z.number(), 
      answer: z.number(), 
      type: z.enum([QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.LIKERT_SCALE]), 
      options: z.array(z.string()), 
      pts: z.number()
    }))
    .mutation( async ({ input, ctx }) => {
        // Get assignments pertaining to course
        return await ctx.db.question.create({
          data: {
            activityId: input.activityId,
            content: input.content,
            index: input.index,
            options: input.options,
            type: input.type,
            answer: input.answer,
            pts: input.pts
          }
        });
    }),

  update: privateProcedure
    .input(z.object({ 
      id: z.string(),
      content: z.string(), 
      index: z.number(), 
      answer: z.number(), 
      type: z.enum([QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.LIKERT_SCALE]), 
      options: z.array(z.string()), 
      pts: z.number()
    }))
    .mutation( async ({ input, ctx }) => {
      return await ctx.db.question.update({
        where: {id: input.id},
        data: {
          content: input.content,
          index: input.index,
          options: input.options,
          type: input.type,
          answer: input.answer,
          pts: input.pts
        }
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string()}))
    .mutation( async ({ input, ctx }) => {
        return await ctx.db.question.delete({
          where: {id: input.id},
        });
    }),
})