-- AlterTable
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER TABLE "user_activity_data" ADD COLUMN     "answersTrace" JSONB[],
ADD COLUMN     "profileId" UUID NOT NULL DEFAULT uuid_generate_v4();
