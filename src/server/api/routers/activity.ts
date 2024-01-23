import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { createEmptyReadingActivity } from "./activities/utils";

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
    }),

  createEmpty: privateProcedure
    .input(z.object({ assignmentId: z.string(), index: z.number() }))
    .mutation( async ({ input, ctx }) => {
        // Get assignments pertaining to course
        return await createEmptyReadingActivity(input.assignmentId, input.index, ctx.db);
    }),

  updateIndex: privateProcedure
    .input(z.object({ id: z.string(), index: z.number() }))
    .mutation( async ({ input, ctx }) => {
        // Get assignments pertaining to course
        return await ctx.db.activity.update({
          where: {id: input.id},
          data: {index: input.index},
        });
    }),

  deleteOne: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation( async ({ input, ctx }) => {
        // Get assignments pertaining an assignment
        return await ctx.db.activity.delete({
          where: {id: input.id},
        });
    }),
})