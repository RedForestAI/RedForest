import { ActivityType } from "@prisma/client";
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
    }),

  createEmpty: privateProcedure
    .input(z.object({ assignmentId: z.string(), index: z.number() }))
    .mutation( async ({ input, ctx }) => {
        // Get assignments pertaining to course
        return await ctx.db.activity.create({
          data: {
            assignmentId: input.assignmentId,
            name: "New Activity",
            description: "New Activity",
            type: ActivityType.READING,
            index: input.index,
          }
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