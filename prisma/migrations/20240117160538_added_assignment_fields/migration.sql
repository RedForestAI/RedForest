-- AlterTable
ALTER TABLE "assignment" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "dueDate" SET DEFAULT CURRENT_TIMESTAMP;
