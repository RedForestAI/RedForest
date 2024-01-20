import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { courseRouter } from "./routers/course";
import { assignmentRouter } from "./routers/assignment";
import { activityRouter } from "./routers/activity";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  course: courseRouter,
  assignment: assignmentRouter,
  activity: activityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
