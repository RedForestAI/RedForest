import { PrismaClient } from "@prisma/client";
import { ActivityType } from "@prisma/client";

export async function createEmptyReadingActivity(assignmentId: string, index: number, db: PrismaClient) {
    // Get assignments pertaining to course
    const activity = await db.activity.create({
      data: {
        assignmentId: assignmentId,
        name: "New Activity",
        description: "New Activity",
        type: ActivityType.READING,
        index: index,
      }
    });

    // Create Reading Activity Companion
    return await db.readingActivity.create({
      data: {
        id: activity.id,
        readingUrl: ['https://arxiv.org/pdf/1708.08021.pdf']
      }
    });
}

export async function deleteActivity(activityId: string, db: PrismaClient) {
  
  // Depending on the type, delete the subactivity data
  const activity = await db.activity.findUnique({where: {id: activityId}});

  // Delete subactivity data
  if (activity?.type === ActivityType.READING) {
    await db.readingActivity.delete({where: {id: activityId}});
  }

  // Delete questions
  await db.question.deleteMany({where: {activityId: activityId}});
  
  // Delete activity
  await db.activity.delete({
    where: {id: activityId},
  });
}