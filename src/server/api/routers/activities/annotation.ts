import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const annotationRouter = createTRPCRouter({
  
  getMany: privateProcedure
    .input(z.object({ activityDataId: z.string() }))
    .query( async ({ input, ctx }) => {
      return await ctx.db.annotation.findMany({
        where: {activityDataId: input.activityDataId},
      });
    }),

  create: privateProcedure
    .input(z.object({ id: z.string(), activityDataId: z.string(), position: z.string(), content: z.string(), fileId: z.string() }))
    .mutation( async ({ input, ctx }) => {
      return await ctx.db.annotation.create({
        data: {
          id: input.id,
          activityDataId: input.activityDataId,
          position: input.position,
          content: input.content,
          fileId: input.fileId,
        }
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation( async ({ input, ctx }) => {
      return await ctx.db.annotation.delete({
        where: {id: input.id}
      });
    }),

  update: privateProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation( async ({ input, ctx }) => {
      return await ctx.db.annotation.update({
        where: {id: input.id},
        data: {content: input.content}
      });
    }),
})