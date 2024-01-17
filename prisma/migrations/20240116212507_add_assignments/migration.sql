-- CreateTable
CREATE TABLE "assignment" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "courseId" UUID NOT NULL,

    CONSTRAINT "assignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
