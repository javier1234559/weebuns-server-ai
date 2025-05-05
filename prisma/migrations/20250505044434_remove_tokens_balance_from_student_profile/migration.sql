/*
  Warnings:

  - You are about to drop the column `tokens_balance` on the `student_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_profile" DROP COLUMN "tokens_balance";

-- AlterTable
ALTER TABLE "token_wallet" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "token_wallet_deleted_at_idx" ON "token_wallet"("deleted_at");
