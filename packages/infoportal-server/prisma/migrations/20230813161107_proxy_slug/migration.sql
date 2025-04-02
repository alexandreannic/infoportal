/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Proxy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Proxy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Proxy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proxy" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Proxy_name_key" ON "Proxy"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Proxy_slug_key" ON "Proxy"("slug");
