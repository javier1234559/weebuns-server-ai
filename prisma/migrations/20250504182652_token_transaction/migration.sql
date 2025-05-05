/*
  Warnings:

  - You are about to drop the `discount_code` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feature_token_config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `token_transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "token_transaction" DROP CONSTRAINT "token_transaction_discount_code_fkey";

-- DropForeignKey
ALTER TABLE "token_transaction" DROP CONSTRAINT "token_transaction_user_id_fkey";

-- DropTable
DROP TABLE "discount_code";

-- DropTable
DROP TABLE "feature_token_config";

-- DropTable
DROP TABLE "token_transaction";

-- DropEnum
DROP TYPE "FeatureCode";

-- DropEnum
DROP TYPE "TokenTransactionType";

-- CreateTable
CREATE TABLE "token_wallet" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_package" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL,
    "price_vnd" INTEGER NOT NULL,
    "price_per_token" INTEGER NOT NULL,
    "old_price_per_token" INTEGER,
    "message" TEXT,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "package_id" UUID,
    "amount_vnd" INTEGER NOT NULL,
    "token_amount" INTEGER NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "transaction_type" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_wallet_user_id_key" ON "token_wallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_transaction_id_key" ON "transaction"("transaction_id");

-- CreateIndex
CREATE INDEX "transaction_user_id_idx" ON "transaction"("user_id");

-- CreateIndex
CREATE INDEX "transaction_status_idx" ON "transaction"("status");

-- CreateIndex
CREATE INDEX "transaction_transaction_type_idx" ON "transaction"("transaction_type");

-- CreateIndex
CREATE INDEX "transaction_payment_date_idx" ON "transaction"("payment_date");

-- AddForeignKey
ALTER TABLE "token_wallet" ADD CONSTRAINT "token_wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "token_package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
