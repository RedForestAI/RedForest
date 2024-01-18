/*
  Warnings:

  - A unique constraint covering the columns `[passwordId]` on the table `course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordId` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "passwordId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "course_password" (
    "id" UUID NOT NULL,
    "courseId" UUID,
    "secret" TEXT NOT NULL,

    CONSTRAINT "course_password_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_password_courseId_key" ON "course_password"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_password_secret_key" ON "course_password"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "course_passwordId_key" ON "course"("passwordId");

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_passwordId_fkey" FOREIGN KEY ("passwordId") REFERENCES "course_password"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
