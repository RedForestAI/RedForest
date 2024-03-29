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
import { traceLogFileRouter } from "./routers/traceLogFile";
import { highlightRouter } from "./routers/activities/highlight";
import { annotationRouter } from "./routers/activities/annotation";
import { courseEnrollmentRouter } from "./routers/courseEnrollment";

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
  traceLogFile: traceLogFileRouter,
  highlight: highlightRouter,
  annotation: annotationRouter,
  courseEnrollment: courseEnrollmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
