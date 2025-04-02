/*
  Warnings:

  - You are about to drop the column `submission_time` on the `KoboAnswers` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `KoboAnswers` table. All the data in the column will be lost.
  - Added the required column `submissionTime` to the `KoboAnswers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KoboAnswers" DROP COLUMN "submission_time",
DROP COLUMN "uuid",
ADD COLUMN     "submissionTime" TIMESTAMP(3) NOT NULL;
