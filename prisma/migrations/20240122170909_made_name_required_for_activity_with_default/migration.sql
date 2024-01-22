/*
  Warnings:

  - Made the column `name` on table `activity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "activity" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT 'Activity';
