/*
  Warnings:

  - You are about to drop the column `activityId` on the `activity_reading` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "activity_reading_activityId_key";

-- AlterTable
ALTER TABLE "activity_reading" DROP COLUMN "activityId";
