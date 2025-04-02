/*
  Warnings:

  - The primary key for the `KoboAnswers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[uuid]` on the table `KoboAnswers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "KoboAnswers" DROP CONSTRAINT "KoboAnswers_pkey",
ADD CONSTRAINT "KoboAnswers_pkey" PRIMARY KEY ("id");

