/*
  Warnings:

  - The required column `activityId` was added to the `tracelog_file` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `profileId` was added to the `tracelog_file` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "tracelog_file" ADD COLUMN     "activityId" UUID NOT NULL,
ADD COLUMN     "profileId" UUID NOT NULL;
