/*
  Warnings:

  - Added the required column `index` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "index" INTEGER NOT NULL;
