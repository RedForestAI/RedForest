import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Role } from "@prisma/client";

export const courseEnrollmentRouter = createTRPCRouter({

  getMany: privateProcedure
    .input(z.object({ courseId: z.string() }))
    .query( async ({ input, ctx }) => {

      return await ctx.db.courseEnrollment.findMany({
        where: {courseId: input.courseId},
      });
    
    })
})