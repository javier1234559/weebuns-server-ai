-- AlterEnum
ALTER TYPE "ContentStatus" ADD VALUE 'pending';

-- CreateTable
CREATE TABLE "Banner" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT NOT NULL,
    "actionLink" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);
