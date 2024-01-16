import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { Role } from "@prisma/client";

export const courseRouter = createTRPCRouter({
  
  get: privateProcedure
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

  create: privateProcedure
    .input(z.object({ name: z.string(), teacherId: z.string() }))
    .mutation(async ({ input, ctx }) => {

      // First check that indeed the user is a teacher
      const teacher = await ctx.db.profile.findUniqueOrThrow({
        where: {id: input.teacherId}
      });
      if (teacher.role !== Role.TEACHER) {
        throw new Error("User is not a teacher");
      }

      // Check that all courses have unique names
      const courses = await ctx.db.course.findMany({
        where: {teacherId: input.teacherId}
      });

      const courseNames = courses.map(course => course.name);
      if (courseNames.includes(input.name)) {
        throw new Error("Course name already exists");
      }

      return await ctx.db.course.create({
        data: {
          name: input.name,
          teacherId: input.teacherId,
        },
      });
    }),
});
