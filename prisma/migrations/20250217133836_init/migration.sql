-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'teacher');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'published', 'private', 'deleted');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('local', 'google', 'facebook');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('bank', 'momo', 'zalopay');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('listening', 'reading', 'writing', 'speaking');

-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('practice', 'test');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('draft', 'submitted', 'completed', 'scored');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('system', 'advertisement', 'submission', 'comment_reply', 'comment_mention');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('like', 'teacher_heart');

-- CreateEnum
CREATE TYPE "TokenTransactionType" AS ENUM ('purchase', 'submission_fee', 'ai_chat_fee', 'upgrade_suggestion_fee', 'reward');

-- CreateEnum
CREATE TYPE "FeatureCode" AS ENUM ('submission', 'ai_chat', 'upgrade_suggestion');

-- CreateTable
CREATE TABLE "reference_data" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metadata" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reference_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "auth_provider" "AuthProvider" NOT NULL DEFAULT 'local',
    "auth_provider_id" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "profile_picture" TEXT,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_profile" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "specialization" "SkillType"[],
    "qualification" TEXT,
    "teaching_experience" INTEGER,
    "hourly_rate" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "teacher_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profile" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "target_study_duration" INTEGER,
    "target_reading" DOUBLE PRECISION,
    "target_listening" DOUBLE PRECISION,
    "target_writing" DOUBLE PRECISION,
    "target_speaking" DOUBLE PRECISION,
    "next_exam_date" TIMESTAMP(3),
    "tokens_balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "student_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson" (
    "id" UUID NOT NULL,
    "skill" "SkillType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "lesson_type" "LessonType" NOT NULL,
    "level" TEXT NOT NULL,
    "level_type" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "time_limit" INTEGER,
    "content" JSONB,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_submission" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "submission_type" "SkillType" NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'draft',
    "content" JSONB,
    "feedback" JSONB,
    "tokens_used" INTEGER NOT NULL DEFAULT 0,
    "submitted_at" TIMESTAMP(3),
    "graded_at" TIMESTAMP(3),
    "graded_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary" (
    "id" UUID NOT NULL,
    "term" TEXT NOT NULL,
    "meaning" TEXT[],
    "example_sentence" TEXT,
    "image_url" TEXT,
    "reference_link" TEXT,
    "reference_name" TEXT,
    "tags" TEXT[],
    "repetition_level" INTEGER NOT NULL DEFAULT 0,
    "next_review" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_practice" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "vocabulary_id" UUID NOT NULL,
    "success_rate" DOUBLE PRECISION,
    "last_practiced" TIMESTAMP(3),
    "next_review" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vocabulary_practice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "parent_id" UUID,
    "entity_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_reaction" (
    "id" UUID NOT NULL,
    "comment_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "ReactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "action_url" TEXT,
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_transaction" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TokenTransactionType" NOT NULL,
    "payment_method" "PaymentType",
    "status" "PaymentStatus" NOT NULL,
    "transaction_id" TEXT,
    "discount_code" TEXT,
    "final_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_code" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "is_percentage" BOOLEAN NOT NULL DEFAULT false,
    "usage_limit" INTEGER NOT NULL,
    "current_usage" INTEGER NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discount_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_token_config" (
    "id" UUID NOT NULL,
    "feature_code" "FeatureCode" NOT NULL,
    "token_cost" INTEGER NOT NULL,
    "is_percentage" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_token_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reference_data_type_is_active_order_index_idx" ON "reference_data"("type", "is_active", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "reference_data_type_code_key" ON "reference_data"("type", "code");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_deleted_at_role_idx" ON "User"("deleted_at", "role");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profile_user_id_key" ON "teacher_profile"("user_id");

-- CreateIndex
CREATE INDEX "teacher_profile_deleted_at_idx" ON "teacher_profile"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "student_profile_user_id_key" ON "student_profile"("user_id");

-- CreateIndex
CREATE INDEX "student_profile_deleted_at_idx" ON "student_profile"("deleted_at");

-- CreateIndex
CREATE INDEX "lesson_skill_status_deleted_at_idx" ON "lesson"("skill", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "lesson_level_topic_idx" ON "lesson"("level", "topic");

-- CreateIndex
CREATE INDEX "lesson_created_by_idx" ON "lesson"("created_by");

-- CreateIndex
CREATE INDEX "lesson_submission_user_id_lesson_id_idx" ON "lesson_submission"("user_id", "lesson_id");

-- CreateIndex
CREATE INDEX "lesson_submission_status_submission_type_idx" ON "lesson_submission"("status", "submission_type");

-- CreateIndex
CREATE INDEX "vocabulary_term_idx" ON "vocabulary"("term");

-- CreateIndex
CREATE INDEX "vocabulary_created_by_idx" ON "vocabulary"("created_by");

-- CreateIndex
CREATE INDEX "vocabulary_next_review_idx" ON "vocabulary"("next_review");

-- CreateIndex
CREATE INDEX "vocabulary_practice_next_review_idx" ON "vocabulary_practice"("next_review");

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_practice_user_id_vocabulary_id_key" ON "vocabulary_practice"("user_id", "vocabulary_id");

-- CreateIndex
CREATE INDEX "comment_entity_id_idx" ON "comment"("entity_id");

-- CreateIndex
CREATE INDEX "comment_parent_id_idx" ON "comment"("parent_id");

-- CreateIndex
CREATE INDEX "comment_user_id_idx" ON "comment"("user_id");

-- CreateIndex
CREATE INDEX "comment_created_at_idx" ON "comment"("created_at");

-- CreateIndex
CREATE INDEX "comment_deleted_at_idx" ON "comment"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "comment_reaction_comment_id_user_id_type_key" ON "comment_reaction"("comment_id", "user_id", "type");

-- CreateIndex
CREATE INDEX "notification_type_user_id_idx" ON "notification"("type", "user_id");

-- CreateIndex
CREATE INDEX "notification_is_global_idx" ON "notification"("is_global");

-- CreateIndex
CREATE INDEX "notification_created_at_idx" ON "notification"("created_at");

-- CreateIndex
CREATE INDEX "token_transaction_user_id_idx" ON "token_transaction"("user_id");

-- CreateIndex
CREATE INDEX "token_transaction_status_idx" ON "token_transaction"("status");

-- CreateIndex
CREATE INDEX "token_transaction_type_idx" ON "token_transaction"("type");

-- CreateIndex
CREATE UNIQUE INDEX "discount_code_code_key" ON "discount_code"("code");

-- CreateIndex
CREATE INDEX "discount_code_code_idx" ON "discount_code"("code");

-- CreateIndex
CREATE UNIQUE INDEX "feature_token_config_feature_code_key" ON "feature_token_config"("feature_code");

-- AddForeignKey
ALTER TABLE "teacher_profile" ADD CONSTRAINT "teacher_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_level_type_level_fkey" FOREIGN KEY ("level_type", "level") REFERENCES "reference_data"("type", "code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_submission" ADD CONSTRAINT "lesson_submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_submission" ADD CONSTRAINT "lesson_submission_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_submission" ADD CONSTRAINT "lesson_submission_graded_by_fkey" FOREIGN KEY ("graded_by") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_practice" ADD CONSTRAINT "vocabulary_practice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_practice" ADD CONSTRAINT "vocabulary_practice_vocabulary_id_fkey" FOREIGN KEY ("vocabulary_id") REFERENCES "vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reaction" ADD CONSTRAINT "comment_reaction_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reaction" ADD CONSTRAINT "comment_reaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_transaction" ADD CONSTRAINT "token_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_transaction" ADD CONSTRAINT "token_transaction_discount_code_fkey" FOREIGN KEY ("discount_code") REFERENCES "discount_code"("code") ON DELETE SET NULL ON UPDATE CASCADE;
