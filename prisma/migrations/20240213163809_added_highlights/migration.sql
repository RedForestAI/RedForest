-- CreateTable
CREATE TABLE "highlight" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "position" JSONB NOT NULL,
    "fileId" UUID NOT NULL,
    "activityDataId" UUID NOT NULL,

    CONSTRAINT "highlight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "highlight" ADD CONSTRAINT "highlight_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "activity_reading_file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlight" ADD CONSTRAINT "highlight_activityDataId_fkey" FOREIGN KEY ("activityDataId") REFERENCES "user_activity_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
