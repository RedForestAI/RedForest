import { PrismaClient } from "@prisma/client";
import { ActivityType } from "@prisma/client";

export async function createEmptyReadingActivity(assignmentId: string, index: number, db: PrismaClient | any) {
    // Get assignments pertaining to course
    const activity = await db.activity.create({
      data: {
        assignmentId: assignmentId,
        name: "New Reading Activity",
        description: "New Reading Activity Description",
        type: ActivityType.READING,
        index: index,
      }
    });

    // Create Reading Activity Companion
    await db.readingActivity.create({
      data: {
        id: activity.id
      }
    });

    return activity;
}

export async function deleteActivity(activityId: string, db: PrismaClient | any) {
  
  // Depending on the type, delete the subactivity data
  const activity = await db.activity.findUnique({where: {id: activityId}});

  // Delete subactivity data
  if (activity?.type === ActivityType.READING) {
    // Delete reading files
    await db.readingFile.deleteMany({where: {activityId: activityId}});
    await db.readingActivity.delete({where: {id: activityId}});
  }

  // Delete questions
  await db.question.deleteMany({where: {activityId: activityId}});
  
  // Delete activity
  await db.activity.delete({
    where: {id: activityId},
  });
}