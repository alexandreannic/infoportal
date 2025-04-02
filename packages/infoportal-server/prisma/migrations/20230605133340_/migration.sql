/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `MpcaPaymentTool` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MpcaPaymentTool" ADD COLUMN     "budgetLineCFR" TEXT,
ADD COLUMN     "budgetLineMPCA" TEXT,
ADD COLUMN     "budgetLineStartUp" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "index" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MpcaPaymentTool_index_key" ON "MpcaPaymentTool"("index");
