/*
  Warnings:

  - You are about to drop the column `studentId` on the `user_activity_data` table. All the data in the column will be lost.
  - Added the required column `userAssignmentDataId` to the `user_activity_data` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_activity_data" DROP CONSTRAINT "user_activity_data_activityId_fkey";

-- DropForeignKey
ALTER TABLE "user_activity_data" DROP CONSTRAINT "user_activity_data_studentId_fkey";

-- AlterTable
ALTER TABLE "user_activity_data" DROP COLUMN "studentId",
ADD COLUMN     "userAssignmentDataId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "user_assignment_data" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "data" JSONB NOT NULL,
    "studentId" UUID NOT NULL,
    "assignmentId" UUID NOT NULL,

    CONSTRAINT "user_assignment_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_assignment_data" ADD CONSTRAINT "user_assignment_data_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_assignment_data" ADD CONSTRAINT "user_assignment_data_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity_data" ADD CONSTRAINT "user_activity_data_userAssignmentDataId_fkey" FOREIGN KEY ("userAssignmentDataId") REFERENCES "user_assignment_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
