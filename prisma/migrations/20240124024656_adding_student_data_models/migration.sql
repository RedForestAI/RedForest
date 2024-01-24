/*
  Warnings:

  - You are about to drop the `file` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_activityId_fkey";

-- DropTable
DROP TABLE "file";

-- CreateTable
CREATE TABLE "user_activity_data" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "data" JSONB NOT NULL,
    "studentId" UUID NOT NULL,
    "activityId" UUID NOT NULL,

    CONSTRAINT "user_activity_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracelog_file" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filepath" TEXT NOT NULL,
    "userActivityDataId" UUID NOT NULL,

    CONSTRAINT "tracelog_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_reading_file" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "activityId" UUID NOT NULL,

    CONSTRAINT "activity_reading_file_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_activity_data" ADD CONSTRAINT "user_activity_data_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity_data" ADD CONSTRAINT "user_activity_data_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracelog_file" ADD CONSTRAINT "tracelog_file_userActivityDataId_fkey" FOREIGN KEY ("userActivityDataId") REFERENCES "user_activity_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_reading_file" ADD CONSTRAINT "activity_reading_file_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activity_reading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
