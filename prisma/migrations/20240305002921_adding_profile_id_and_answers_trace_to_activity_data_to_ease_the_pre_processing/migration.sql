/*
  Warnings:

  - The required column `profileId` was added to the `user_activity_data` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "user_activity_data" ADD COLUMN     "answersTrace" JSONB[],
ADD COLUMN     "profileId" UUID NOT NULL;
