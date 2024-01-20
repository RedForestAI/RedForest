import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const readingActivityRouter = createTRPCRouter({
  getOne: privateProcedure
    .input(z.object({ id: z.string() }))
    .query( async ({ input, ctx }) => {
      return await ctx.db.readingActivity.findUnique({
        where: {id: input.id},
      });
    })
})