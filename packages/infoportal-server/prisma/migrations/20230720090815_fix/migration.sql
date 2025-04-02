/*
  Warnings:

  - The values [READ,WRITE,ADMIN] on the enum `FeatureAccessLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FeatureAccessLevel_new" AS ENUM ('Read', 'Write', 'Admin');
ALTER TABLE "FeatureAccess" ALTER COLUMN "level" TYPE "FeatureAccessLevel_new" USING ("level"::text::"FeatureAccessLevel_new");
ALTER TYPE "FeatureAccessLevel" RENAME TO "FeatureAccessLevel_old";
ALTER TYPE "FeatureAccessLevel_new" RENAME TO "FeatureAccessLevel";
DROP TYPE "FeatureAccessLevel_old";
COMMIT;
