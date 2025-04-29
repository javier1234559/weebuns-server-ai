/*
  Warnings:

  - You are about to drop the column `tags` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lesson_submission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `reference_data` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "comment_reaction" DROP CONSTRAINT "comment_reaction_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_created_by_fkey";

-- DropForeignKey
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_level_type_level_fkey";

-- DropForeignKey
ALTER TABLE "lesson_submission" DROP CONSTRAINT "lesson_submission_graded_by_fkey";

-- DropForeignKey
ALTER TABLE "lesson_submission" DROP CONSTRAINT "lesson_submission_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson_submission" DROP CONSTRAINT "lesson_submission_user_id_fkey";

-- AlterTable
ALTER TABLE "vocabulary" DROP COLUMN "tags";

-- DropTable
DROP TABLE "comment";

-- DropTable
DROP TABLE "lesson";

-- DropTable
DROP TABLE "lesson_submission";

-- CreateTable
CREATE TABLE "Lesson" (
    "id" UUID NOT NULL,
    "skill" "SkillType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "lessonType" "LessonType" NOT NULL,
    "level_code" TEXT NOT NULL,
    "topic_code" TEXT NOT NULL,
    "time_limit" INTEGER,
    "content" JSONB NOT NULL,
    "thumbnail_url" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSubmission" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "submission_type" "SkillType" NOT NULL DEFAULT 'writing',
    "status" "SubmissionStatus" NOT NULL DEFAULT 'draft',
    "content" JSONB,
    "feedback" JSONB,
    "tokens_used" INTEGER NOT NULL DEFAULT 0,
    "submitted_at" TIMESTAMP(3),
    "graded_at" TIMESTAMP(3),
    "graded_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "LessonSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "parent_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "lessonSubmissionId" UUID,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lesson_skill_status_deleted_at_idx" ON "Lesson"("skill", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "Lesson_level_code_topic_code_idx" ON "Lesson"("level_code", "topic_code");

-- CreateIndex
CREATE INDEX "Lesson_created_by_idx" ON "Lesson"("created_by");

-- CreateIndex
CREATE INDEX "LessonSubmission_lesson_id_user_id_idx" ON "LessonSubmission"("lesson_id", "user_id");

-- CreateIndex
CREATE INDEX "LessonSubmission_status_submitted_at_idx" ON "LessonSubmission"("status", "submitted_at");

-- CreateIndex
CREATE INDEX "LessonSubmission_graded_by_graded_at_idx" ON "LessonSubmission"("graded_by", "graded_at");

-- CreateIndex
CREATE INDEX "Comment_lesson_id_idx" ON "Comment"("lesson_id");

-- CreateIndex
CREATE INDEX "Comment_user_id_idx" ON "Comment"("user_id");

-- CreateIndex
CREATE INDEX "Comment_parent_id_idx" ON "Comment"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "reference_data_code_key" ON "reference_data"("code");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_level_code_fkey" FOREIGN KEY ("level_code") REFERENCES "reference_data"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_topic_code_fkey" FOREIGN KEY ("topic_code") REFERENCES "reference_data"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSubmission" ADD CONSTRAINT "LessonSubmission_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSubmission" ADD CONSTRAINT "LessonSubmission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSubmission" ADD CONSTRAINT "LessonSubmission_graded_by_fkey" FOREIGN KEY ("graded_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_lessonSubmissionId_fkey" FOREIGN KEY ("lessonSubmissionId") REFERENCES "LessonSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reaction" ADD CONSTRAINT "comment_reaction_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
