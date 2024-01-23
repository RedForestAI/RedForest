import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const readingFileRouter = createTRPCRouter({

  getMany: privateProcedure
    .input(z.object({ activityId: z.string() }))
    .query( async ({ input, ctx }) => {
      return await ctx.db.readingFile.findMany({where: {activityId: input.activityId}});
    }),

  create: privateProcedure
    .input(z.object({ title: z.string(), filepath: z.string(), size: z.number(), index: z.number(), activityId: z.string() }))
    .mutation( async ({ input, ctx }) => {
      return await ctx.db.readingFile.create({
        data: {
          title: input.title,
          filepath: input.filepath,
          size: input.size,
          index: input.index,
          activity: { connect: { id: input.activityId }},
        }
      });
    }),
  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation( async ({ input, ctx }) => {
      return await ctx.db.readingFile.delete({where: {id: input.id}});
    }),
  })