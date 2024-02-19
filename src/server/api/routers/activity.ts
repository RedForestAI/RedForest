import { ActivityType } from "@prisma/client";
import { deleteActivity } from "./activities/utils";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { createEmptyReadingActivity } from "./activities/utils";

export const activityRouter = createTRPCRouter({
  getMany: privateProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Get assignments pertaining to course
      return await ctx.db.activity.findMany({
        where: { assignmentId: input.assignmentId },
      });
    }),

  getOne: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Get assignments pertaining to course
      return await ctx.db.activity.findUnique({
        where: { id: input.id },
      });
    }),

  createEmpty: privateProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        type: z.enum([
          ActivityType.READING,
          ActivityType.QUESTIONING,
          ActivityType.READING_BEHAVIOR,
        ]),
        index: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Get assignments pertaining to course
      switch (input.type) {
        case ActivityType.READING:
          return await createEmptyReadingActivity(
            input.assignmentId,
            input.index,
            ctx.db,
          );
        case ActivityType.QUESTIONING:
          return await ctx.db.activity.create({
            data: {
              assignmentId: input.assignmentId,
              type: input.type,
              index: input.index,
              name: "New Question Activity",
              description: "New Question Activity Description",
            },
          });
        case ActivityType.READING_BEHAVIOR:
          return await ctx.db.activity.create({
            data: {
              assignmentId: input.assignmentId,
              type: input.type,
              index: input.index,
              name: "New Reading Behavior Activity",
              description: "New Reading Behavior Activity Description"
            }
          });
      }
    }),

  updateIndex: privateProcedure
    .input(z.object({ id: z.string(), index: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Get assignments pertaining to course
      return await ctx.db.activity.update({
        where: { id: input.id },
        data: { index: input.index },
      });
    }),

  update: privateProcedure
    .input(
      z.object({ id: z.string(), name: z.string(), description: z.string() }),
    )
    .mutation(async ({ input, ctx }) => {
      // Get assignments pertaining to course
      return await ctx.db.activity.update({
        where: { id: input.id },
        data: { name: input.name, description: input.description },
      });
    }),

  deleteOne: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Get assignments pertaining an assignment
      return await deleteActivity(input.id, ctx.db);
    }),
});
