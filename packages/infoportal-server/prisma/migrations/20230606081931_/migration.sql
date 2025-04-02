/*
  Warnings:

  - You are about to drop the column `answersId` on the `MpcaPaymentTool` table. All the data in the column will be lost.
  - The `budgetLineCFR` column on the `MpcaPaymentTool` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `budgetLineMPCA` column on the `MpcaPaymentTool` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `budgetLineStartUp` column on the `MpcaPaymentTool` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MpcaPaymentTool" DROP COLUMN "answersId",
ADD COLUMN     "cashAndVoucherAssistanceAssistant" TEXT,
ADD COLUMN     "financeAndAdministrationOfficer" TEXT,
ADD COLUMN     "headOfOperation" TEXT,
DROP COLUMN "budgetLineCFR",
ADD COLUMN     "budgetLineCFR" INTEGER,
DROP COLUMN "budgetLineMPCA",
ADD COLUMN     "budgetLineMPCA" INTEGER,
DROP COLUMN "budgetLineStartUp",
ADD COLUMN     "budgetLineStartUp" INTEGER;
