/*
  Warnings:

  - You are about to drop the column `drcJobTitle` on the `FeatureAccess` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeatureAccess" DROP COLUMN "drcJobTitle",
ADD COLUMN     "drcJob" TEXT,
ADD COLUMN     "drcOffice" TEXT;
