/*
  Warnings:

  - You are about to drop the column `lesson_id` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `identifier_id` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Comment_lesson_id_idx";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "lesson_id",
ADD COLUMN     "identifier_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Comment_identifier_id_idx" ON "Comment"("identifier_id");
