/*
  Warnings:

  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReadingActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_activityId_fkey";

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "ReadingActivity";

-- CreateTable
CREATE TABLE "activity" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "type" "ActivityType" NOT NULL,
    "assignmentId" UUID NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_activity" (
    "id" UUID NOT NULL,
    "readingUrl" TEXT[],

    CONSTRAINT "reading_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answer" INTEGER NOT NULL,
    "activityId" UUID NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
