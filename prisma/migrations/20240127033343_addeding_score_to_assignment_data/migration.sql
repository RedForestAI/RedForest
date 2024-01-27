/*
  Warnings:

  - You are about to drop the column `data` on the `user_assignment_data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_assignment_data" DROP COLUMN "data",
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;
