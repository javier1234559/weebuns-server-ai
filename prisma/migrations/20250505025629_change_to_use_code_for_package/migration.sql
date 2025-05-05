/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `token_package` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `token_package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "token_package" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "token_package_code_key" ON "token_package"("code");
