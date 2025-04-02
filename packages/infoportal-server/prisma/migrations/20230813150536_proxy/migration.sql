/*
  Warnings:

  - You are about to drop the column `donorId` on the `KoboAnswers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "KoboAnswers" DROP COLUMN "donorId";

-- CreateTable
CREATE TABLE "Proxy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "disabled" BOOLEAN,

    CONSTRAINT "Proxy_pkey" PRIMARY KEY ("id")
);
