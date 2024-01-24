import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const activityDataRouter = createTRPCRouter({
  getOne: privateProcedure
    .input(z.object({ activityId: z.string(), profileId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.userActivityData.findFirst({
        where: {
          activityId: input.activityId,
          studentId: input.profileId,
        },
      });
    }),
});
