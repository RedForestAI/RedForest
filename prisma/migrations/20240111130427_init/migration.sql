/*
  Warnings:

  - You are about to drop the `profile_courses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "profile_courses" DROP CONSTRAINT "profile_courses_courseId_fkey";

-- DropForeignKey
ALTER TABLE "profile_courses" DROP CONSTRAINT "profile_courses_studentId_fkey";

-- DropTable
DROP TABLE "profile_courses";

-- CreateTable
CREATE TABLE "course_enrollment" (
    "id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "courseId" UUID NOT NULL,

    CONSTRAINT "course_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "course_enrollment_studentId_courseId_idx" ON "course_enrollment"("studentId", "courseId");

-- AddForeignKey
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
