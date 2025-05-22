/*
  Warnings:

  - The values [completed] on the enum `SubmissionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('draft', 'submitted', 'taken', 'scored');
ALTER TABLE "LessonSubmission" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "LessonSubmission" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "SubmissionStatus_old";
ALTER TABLE "LessonSubmission" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;
