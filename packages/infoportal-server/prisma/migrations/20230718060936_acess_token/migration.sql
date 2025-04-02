/*
  Warnings:

  - You are about to drop the column `createdBy` on the `FeatureAccess` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeatureAccess" DROP COLUMN "createdBy";

-- CreateTable
CREATE TABLE "AccessToken" (
    "id" TEXT NOT NULL,
    "createdBy" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);
