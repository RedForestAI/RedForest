import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { courseRouter } from "./routers/course";
import { assignmentRouter } from "./routers/assignment";
import { activityRouter } from "./routers/activity";
import { readingActivityRouter } from "./routers/activities/reading";
import { questionRouter } from "./routers/question";
import { readingFileRouter } from "./routers/activities/readingFile";
import { assignmentDataRouter } from "./routers/assignmentData";
import { activityDataRouter } from "./routers/activityData";

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
  readingActivity: readingActivityRouter,
  question: questionRouter,
  readingFile: readingFileRouter,
  assignmentData: assignmentDataRouter,
  activityData: activityDataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
