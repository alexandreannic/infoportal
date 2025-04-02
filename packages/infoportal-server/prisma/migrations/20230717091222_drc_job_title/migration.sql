-- AlterTable
ALTER TABLE "FeatureAccess" ADD COLUMN     "drcJobTitle" TEXT,
ADD COLUMN     "drcSector" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "officer" TEXT;
