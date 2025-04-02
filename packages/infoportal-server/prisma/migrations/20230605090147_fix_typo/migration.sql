/*
  Warnings:

  - The primary key for the `MpcaPaymentToolAnswers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `mpcaFinanceDocId` on the `MpcaPaymentToolAnswers` table. All the data in the column will be lost.
  - You are about to drop the `MpcaFinanceDoc` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mpcaPaymentToolId` to the `MpcaPaymentToolAnswers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MpcaPaymentToolAnswers" DROP CONSTRAINT "MpcaPaymentToolAnswers_mpcaFinanceDocId_fkey";

-- AlterTable
ALTER TABLE "MpcaPaymentToolAnswers" DROP CONSTRAINT "MpcaPaymentToolAnswers_pkey",
DROP COLUMN "mpcaFinanceDocId",
ADD COLUMN     "mpcaPaymentToolId" TEXT NOT NULL,
ADD CONSTRAINT "MpcaPaymentToolAnswers_pkey" PRIMARY KEY ("koboAnswersId", "mpcaPaymentToolId");

-- DropTable
DROP TABLE "MpcaFinanceDoc";

-- CreateTable
CREATE TABLE "MpcaPaymentTool" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MpcaPaymentTool_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MpcaPaymentToolAnswers" ADD CONSTRAINT "MpcaPaymentToolAnswers_mpcaPaymentToolId_fkey" FOREIGN KEY ("mpcaPaymentToolId") REFERENCES "MpcaPaymentTool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
