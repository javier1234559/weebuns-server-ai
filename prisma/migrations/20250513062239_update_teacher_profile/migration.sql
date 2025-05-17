/*
  Warnings:

  - You are about to drop the column `hourly_rate` on the `teacher_profile` table. All the data in the column will be lost.
  - You are about to drop the column `qualification` on the `teacher_profile` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `teacher_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;

-- AlterTable
ALTER TABLE "teacher_profile" DROP COLUMN "hourly_rate",
DROP COLUMN "qualification",
DROP COLUMN "specialization",
ADD COLUMN     "certifications" TEXT,
ADD COLUMN     "intro_video_url_embed" TEXT,
ADD COLUMN     "long_bio" TEXT,
ADD COLUMN     "other" TEXT,
ALTER COLUMN "teaching_experience" SET DATA TYPE TEXT;
