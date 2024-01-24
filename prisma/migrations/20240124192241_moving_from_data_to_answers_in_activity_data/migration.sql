/*
  Warnings:

  - You are about to drop the column `data` on the `user_activity_data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_activity_data" DROP COLUMN "data",
ADD COLUMN     "answers" INTEGER[],
ADD COLUMN     "answersAt" TIMESTAMP(3)[];
