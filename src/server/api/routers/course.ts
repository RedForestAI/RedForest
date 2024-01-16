import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const courseRouter = createTRPCRouter({
  getCourses: privateProcedure
    .input(z.object({ profileId: z.string() }))
    .query( async ({ input, ctx }) => {
      // Get course enrollments
      console.log(input.profileId);

      const courseEnrollments = await ctx.db.courseEnrollment.findMany({
        where: {studentId: input.profileId},
      });

      console.log(courseEnrollments);

      // Get course
      return await Promise.all(
        courseEnrollments.map(async (courseEnrollment) => ctx.db.course.findUniqueOrThrow({
          where: {id: courseEnrollment.courseId},
        }))
      );
    }),
});
