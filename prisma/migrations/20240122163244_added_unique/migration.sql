/*
  Warnings:

  - A unique constraint covering the columns `[activityId]` on the table `activity_reading` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "activity_reading_activityId_key" ON "activity_reading"("activityId");
