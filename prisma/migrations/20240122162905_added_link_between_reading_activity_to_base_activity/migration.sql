/*
  Warnings:

  - You are about to drop the `reading` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "reading";

-- CreateTable
CREATE TABLE "activity_reading" (
    "id" UUID NOT NULL,
    "activityId" UUID NOT NULL,
    "readingUrl" TEXT[],

    CONSTRAINT "activity_reading_pkey" PRIMARY KEY ("id")
);
