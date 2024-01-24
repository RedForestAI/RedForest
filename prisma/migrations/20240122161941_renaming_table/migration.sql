/*
  Warnings:

  - You are about to drop the `activity_reading` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "activity_reading";

-- CreateTable
CREATE TABLE "reading" (
    "id" UUID NOT NULL,
    "readingUrl" TEXT[],

    CONSTRAINT "reading_pkey" PRIMARY KEY ("id")
);
