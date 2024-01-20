import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const assignmentRouter = createTRPCRouter({
  get: privateProcedure
    .input(z.object({ courseId: z.string()}))
    .query( async ({ input, ctx }) => {

      // Get assignments pertaining to course
      return await ctx.db.assignment.findMany({
        where: {courseId: input.courseId},
      });
    }),

  getOne: privateProcedure
    .input(z.object({ id: z.string()}))
    .query( async ({ input, ctx }) => {

      // Get assignment by id
      console.log(input.id)
      return await ctx.db.assignment.findUniqueOrThrow({
        where: {id: input.id},
      });
    }),

  createEmpty: privateProcedure
    .input(z.object({ courseId: z.string()}))
    .mutation(async ({ input, ctx }) => {

      // Create empty assignment
      return ctx.db.assignment.create({
        data: {
          courseId: input.courseId,
          name: "",
        }
      });
    }),

  updateSettings: privateProcedure
    .input(z.object({ id: z.string(), name: z.string(), dueDate: z.date(), published: z.boolean()}))
    .mutation(async ({ input, ctx }) => {

      return ctx.db.assignment.update({
        where: {id: input.id},
        data: {
          name: input.name,
          dueDate: input.dueDate,
          published: input.published,
        }
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string()}))
    .mutation(async ({ input, ctx }) => {

      // Delete assignment
      return ctx.db.assignment.delete({
        where: {id: input.id},
      });
    }),
});