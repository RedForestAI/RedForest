/*
  Warnings:

  - You are about to drop the column `readingUrl` on the `activity_reading` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "activity_reading" DROP COLUMN "readingUrl";

-- CreateTable
CREATE TABLE "file" (
    "id" UUID NOT NULL,
    "filepath" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "activityId" UUID NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activity_reading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
