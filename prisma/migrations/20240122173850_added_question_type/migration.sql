/*
  Warnings:

  - Changed the type of `type` on the `question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "question" DROP COLUMN "type",
ADD COLUMN     "type" "QuestionType" NOT NULL;
