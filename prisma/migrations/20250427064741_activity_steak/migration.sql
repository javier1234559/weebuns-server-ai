-- CreateTable
CREATE TABLE "study_activity" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "activity_date" TIMESTAMP(3) NOT NULL,
    "reading" INTEGER NOT NULL DEFAULT 0,
    "listening" INTEGER NOT NULL DEFAULT 0,
    "writing" INTEGER NOT NULL DEFAULT 0,
    "speaking" INTEGER NOT NULL DEFAULT 0,
    "total_minutes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "study_activity_user_id_activity_date_idx" ON "study_activity"("user_id", "activity_date");

-- CreateIndex
CREATE UNIQUE INDEX "study_activity_user_id_activity_date_key" ON "study_activity"("user_id", "activity_date");

-- AddForeignKey
ALTER TABLE "study_activity" ADD CONSTRAINT "study_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
