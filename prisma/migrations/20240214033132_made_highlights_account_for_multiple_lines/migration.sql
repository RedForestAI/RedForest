/*
  Warnings:

  - You are about to drop the column `position` on the `highlight` table. All the data in the column will be lost.
  - Added the required column `rects` to the `highlight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "highlight" DROP COLUMN "position",
ADD COLUMN     "rects" JSONB NOT NULL;
