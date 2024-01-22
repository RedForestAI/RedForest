/*
  Warnings:

  - Added the required column `type` to the `question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'LIKERT_SCALE');

-- AlterTable
ALTER TABLE "question" ADD COLUMN     "type" TEXT NOT NULL;
