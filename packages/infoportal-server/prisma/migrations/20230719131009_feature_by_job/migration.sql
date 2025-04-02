-- CreateEnum
CREATE TYPE "FeatureAccessType" AS ENUM ('KoboForm');

-- AlterTable
ALTER TABLE "FeatureAccess" ADD COLUMN     "featureType" "FeatureAccessType";
