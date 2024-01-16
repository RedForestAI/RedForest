import { Role } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  getProfile: privateProcedure.query(({ ctx }) => {
    if (!ctx.user.data.user) {
      throw new Error("User is not authenticated");
    }
    return ctx.db.profile.findFirstOrThrow({
      where: {
        id: ctx.user.data.user.id,
      },
    });
  }),
  convertToTeacher: privateProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Authenticated user and given profileID
      if (!ctx.user.data.user || input.profileId !== ctx.user.data.user.id) {
        throw new Error("User is not authenticated");
      }

      // Confirm that the user is a student
      const student = await ctx.db.profile.findUniqueOrThrow({
        where: { id: input.profileId },
      });
      if (student.role !== "STUDENT") {
        throw new Error("User is not a student");
      }

      // First we need to delete all course Enrollments
      await ctx.db.courseEnrollment.deleteMany({
        where: { studentId: input.profileId },
      });

      // Then convert the user to a teacher
      return await ctx.db.profile.update({
        where: { id: input.profileId },
        data: { role: Role.TEACHER },
      });
    })
});
