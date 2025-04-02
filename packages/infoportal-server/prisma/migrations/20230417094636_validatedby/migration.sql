/*
  Warnings:

  - Added the required column `lastValidatedTimestamp` to the `KoboAnswers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KoboAnswers" ADD COLUMN     "lastValidatedTimestamp" INTEGER NOT NULL,
ADD COLUMN     "validatedBy" TEXT;
