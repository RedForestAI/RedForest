/*
  Warnings:

  - You are about to drop the column `userActivityDataId` on the `tracelog_file` table. All the data in the column will be lost.
  - You are about to drop the column `userAssignmentDataId` on the `user_activity_data` table. All the data in the column will be lost.
  - Added the required column `activityDataId` to the `tracelog_file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignmentDataId` to the `user_activity_data` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tracelog_file" DROP CONSTRAINT "tracelog_file_userActivityDataId_fkey";

-- DropForeignKey
ALTER TABLE "user_activity_data" DROP CONSTRAINT "user_activity_data_userAssignmentDataId_fkey";

-- AlterTable
ALTER TABLE "tracelog_file" DROP COLUMN "userActivityDataId",
ADD COLUMN     "activityDataId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "user_activity_data" DROP COLUMN "userAssignmentDataId",
ADD COLUMN     "assignmentDataId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "user_activity_data" ADD CONSTRAINT "user_activity_data_assignmentDataId_fkey" FOREIGN KEY ("assignmentDataId") REFERENCES "user_assignment_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracelog_file" ADD CONSTRAINT "tracelog_file_activityDataId_fkey" FOREIGN KEY ("activityDataId") REFERENCES "user_activity_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
