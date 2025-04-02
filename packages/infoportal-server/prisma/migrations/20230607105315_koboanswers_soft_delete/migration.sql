-- AlterTable
ALTER TABLE "KoboAnswers" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT;
