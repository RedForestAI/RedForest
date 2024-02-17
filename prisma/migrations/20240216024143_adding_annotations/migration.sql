-- CreateTable
CREATE TABLE "annotation" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "position" JSONB NOT NULL,
    "fileId" UUID NOT NULL,
    "activityDataId" UUID NOT NULL,

    CONSTRAINT "annotation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "annotation" ADD CONSTRAINT "annotation_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "activity_reading_file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annotation" ADD CONSTRAINT "annotation_activityDataId_fkey" FOREIGN KEY ("activityDataId") REFERENCES "user_activity_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
