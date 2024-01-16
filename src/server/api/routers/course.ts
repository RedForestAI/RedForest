import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { Role } from "@prisma/client";

export const courseRouter = createTRPCRouter({
  getCourses: privateProcedure
    .input(z.object({ profileId: z.string(), role: z.enum([Role.TEACHER, Role.STUDENT]) }))
    .query( async ({ input, ctx }) => {
      // Get course enrollments
      // console.log(input.profileId);

      if (input.role === Role.TEACHER) {
        return await ctx.db.course.findMany({
          where: {teacherId: input.profileId},
        });
      }
      else if (input.role === Role.STUDENT) {
        const courseEnrollments = await ctx.db.courseEnrollment.findMany({
          where: {studentId: input.profileId},
        });
  
        // console.log(courseEnrollments);
  
        // Get course
        return await Promise.all(
          courseEnrollments.map(async (courseEnrollment) => ctx.db.course.findUniqueOrThrow({
            where: {id: courseEnrollment.courseId},
          }))
        );
      }
      else {
        throw new Error("Invalid role");
      }
    }),
});
