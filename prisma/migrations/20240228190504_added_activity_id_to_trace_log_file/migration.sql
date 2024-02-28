/*
  Warnings:

  - Added the required column `activityId` to the `tracelog_file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tracelog_file" ADD COLUMN     "activityId" UUID NOT NULL;
