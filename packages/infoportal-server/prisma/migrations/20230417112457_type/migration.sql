/*
  Warnings:

  - The primary key for the `KoboAnswers` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "KoboAnswers" DROP CONSTRAINT "KoboAnswers_pkey",
ALTER COLUMN "formId" SET DATA TYPE TEXT,
ADD CONSTRAINT "KoboAnswers_pkey" PRIMARY KEY ("formId");
