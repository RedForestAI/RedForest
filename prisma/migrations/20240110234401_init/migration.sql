-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'student', 'teacher');

-- CreateTable
CREATE TABLE "profile" (
    "id" UUID NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'student',

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToProfile" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToProfile_AB_unique" ON "_CourseToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToProfile_B_index" ON "_CourseToProfile"("B");

-- AddForeignKey
ALTER TABLE "_CourseToProfile" ADD CONSTRAINT "_CourseToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToProfile" ADD CONSTRAINT "_CourseToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
