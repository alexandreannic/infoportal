/*
  Warnings:

  - You are about to drop the `ApplicationAccess` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FeatureAccessLevel" AS ENUM ('READ', 'WRITE', 'ADMIN');

-- DropTable
DROP TABLE "ApplicationAccess";

-- DropEnum
DROP TYPE "ApplicationAccessLevel";

-- CreateTable
CREATE TABLE "FeatureAccess" (
    "id" TEXT NOT NULL,
    "featureId" TEXT,
    "params" JSONB,
    "level" "FeatureAccessLevel" NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "FeatureAccess_pkey" PRIMARY KEY ("id")
);
