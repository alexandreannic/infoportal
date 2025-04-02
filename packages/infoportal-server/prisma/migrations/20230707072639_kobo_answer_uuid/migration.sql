/*
  Warnings:

  - The primary key for the `KoboAnswers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MpcaPaymentToolAnswers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `koboAnswersId` on the `MpcaPaymentToolAnswers` table. All the data in the column will be lost.
  - You are about to drop the `KoboProtHhsDonor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,formId]` on the table `KoboAnswers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `KoboAnswers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `koboAnswersUuid` to the `MpcaPaymentToolAnswers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "KoboProtHhsDonor" DROP CONSTRAINT "KoboProtHhsDonor_answerId_fkey";

-- DropForeignKey
ALTER TABLE "MpcaPaymentToolAnswers" DROP CONSTRAINT "MpcaPaymentToolAnswers_koboAnswersId_fkey";

-- AlterTable
ALTER TABLE "KoboAnswers" DROP CONSTRAINT "KoboAnswers_pkey",
ADD COLUMN     "uuid" TEXT NOT NULL,
ADD CONSTRAINT "KoboAnswers_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "MpcaPaymentToolAnswers" DROP CONSTRAINT "MpcaPaymentToolAnswers_pkey",
DROP COLUMN "koboAnswersId",
ADD COLUMN     "koboAnswersUuid" TEXT NOT NULL,
ADD CONSTRAINT "MpcaPaymentToolAnswers_pkey" PRIMARY KEY ("koboAnswersUuid", "mpcaPaymentToolId");

-- DropTable
DROP TABLE "KoboProtHhsDonor";

-- CreateIndex
CREATE UNIQUE INDEX "KoboAnswers_id_formId_key" ON "KoboAnswers"("id", "formId");

-- AddForeignKey
ALTER TABLE "MpcaPaymentToolAnswers" ADD CONSTRAINT "MpcaPaymentToolAnswers_koboAnswersUuid_fkey" FOREIGN KEY ("koboAnswersUuid") REFERENCES "KoboAnswers"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
