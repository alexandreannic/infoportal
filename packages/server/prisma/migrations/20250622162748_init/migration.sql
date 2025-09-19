-- CreateEnum
CREATE TYPE "WorkspaceAccessLevel" AS ENUM ('Admin', 'User');

-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('deployed', 'archived', 'draft');

-- CreateEnum
CREATE TYPE "FormSource" AS ENUM ('kobo', 'internal');

-- CreateEnum
CREATE TYPE "UserProvider" AS ENUM ('google', 'microsoft');

-- CreateEnum
CREATE TYPE "FeatureAccessLevel" AS ENUM ('Read', 'Write', 'Admin');

-- CreateEnum
CREATE TYPE "FeatureAccessType" AS ENUM ('KoboForm');

-- CreateEnum
CREATE TYPE "DatabaseViewVisibility" AS ENUM ('Public', 'Private', 'Sealed');

-- CreateEnum
CREATE TYPE "DatabaseViewColVisibility" AS ENUM ('Hidden', 'Visible');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sector" TEXT,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceAccess" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "level" "WorkspaceAccessLevel" NOT NULL,
    "userId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,

    CONSTRAINT "WorkspaceAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KoboServer" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "urlV1" TEXT,
    "token" TEXT NOT NULL,
    "workspaceId" UUID,

    CONSTRAINT "KoboServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KoboForm" (
    "id" VARCHAR(32) NOT NULL,
    "name" TEXT NOT NULL,
    "serverId" UUID NOT NULL,
    "source" "FormSource" NOT NULL DEFAULT 'kobo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deploymentStatus" "DeploymentStatus",
    "updatedBy" TEXT,
    "uploadedBy" TEXT,
    "enketoUrl" TEXT,
    "submissionsCount" INTEGER,
    "activeVersionId" TEXT,

    CONSTRAINT "KoboForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSchema" (
    "id" VARCHAR(32) NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT,
    "message" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "FormSource" NOT NULL,
    "schema" JSONB NOT NULL,
    "formId" TEXT NOT NULL,

    CONSTRAINT "FormSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KoboAnswers" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "version" TEXT,
    "submissionTime" TIMESTAMP(3) NOT NULL,
    "validationStatus" TEXT,
    "validatedBy" TEXT,
    "source" "FormSource" NOT NULL DEFAULT 'kobo',
    "lastValidatedTimestamp" INTEGER,
    "geolocation" TEXT,
    "answers" JSONB NOT NULL,
    "attachments" JSONB[],
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "tags" JSONB,

    CONSTRAINT "KoboAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KoboAnswersHistory" (
    "id" UUID NOT NULL,
    "formId" TEXT,
    "answerId" TEXT,
    "by" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT,
    "property" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,

    CONSTRAINT "KoboAnswersHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastConnectedAt" TIMESTAMP(3),
    "accessToken" TEXT,
    "name" TEXT,
    "drcJob" TEXT,
    "drcOffice" TEXT,
    "avatar" BYTEA,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "officer" TEXT,
    "provider" "UserProvider" DEFAULT 'google',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" UUID NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detail" TEXT,
    "userId" UUID,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureAccess" (
    "id" UUID NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "featureType" "FeatureAccessType",
    "drcJob" TEXT,
    "featureId" TEXT,
    "email" TEXT,
    "level" "FeatureAccessLevel" NOT NULL,
    "params" JSONB,
    "groupId" UUID,
    "workspaceId" UUID NOT NULL,

    CONSTRAINT "FeatureAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "workspaceId" UUID NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupItem" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "drcJob" TEXT,
    "drcOffice" TEXT,
    "email" TEXT,
    "level" "FeatureAccessLevel" NOT NULL,
    "groupId" UUID,

    CONSTRAINT "GroupItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessToken" (
    "id" UUID NOT NULL,
    "createdBy" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proxy" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "disabled" BOOLEAN,

    CONSTRAINT "Proxy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProxyUsage" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddresses" TEXT[],
    "proxyId" UUID NOT NULL,

    CONSTRAINT "ProxyUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JsonStore" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "JsonStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatabaseView" (
    "id" UUID NOT NULL,
    "databaseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "visibility" "DatabaseViewVisibility" NOT NULL DEFAULT 'Private',

    CONSTRAINT "DatabaseView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatabaseViewCol" (
    "name" TEXT NOT NULL,
    "viewId" UUID NOT NULL,
    "width" INTEGER,
    "visibility" "DatabaseViewColVisibility" DEFAULT 'Visible'
);

-- CreateTable
CREATE TABLE "EmailOutBox" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "context" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "cc" TEXT,
    "subject" TEXT NOT NULL,
    "content" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "tags" JSONB,

    CONSTRAINT "EmailOutBox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_KoboFormToWorkspace" (
    "A" VARCHAR(32) NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_KoboFormToWorkspace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_KoboAnswersToHistory" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_KoboAnswersToHistory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AccessTokenToWorkspace" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AccessTokenToWorkspace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProxyToWorkspace" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ProxyToWorkspace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EmailOutBoxToWorkspace" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_EmailOutBoxToWorkspace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

-- CreateIndex
CREATE INDEX "Workspace_slug_idx" ON "Workspace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceAccess_workspaceId_userId_key" ON "WorkspaceAccess"("workspaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "KoboForm_activeVersionId_key" ON "KoboForm"("activeVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "FormSchema_source_version_key" ON "FormSchema"("source", "version");

-- CreateIndex
CREATE INDEX "KoboAnswers_deletedAt_idx" ON "KoboAnswers"("deletedAt");

-- CreateIndex
CREATE INDEX "KoboAnswers_date_idx" ON "KoboAnswers"("date");

-- CreateIndex
CREATE INDEX "KoboAnswers_formId_idx" ON "KoboAnswers"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "KoboAnswers_id_formId_key" ON "KoboAnswers"("id", "formId");

-- CreateIndex
CREATE INDEX "KoboAnswersHistory_formId_idx" ON "KoboAnswersHistory"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "Proxy_name_key" ON "Proxy"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Proxy_slug_key" ON "Proxy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "JsonStore_key_key" ON "JsonStore"("key");

-- CreateIndex
CREATE INDEX "DatabaseView_name_idx" ON "DatabaseView"("name");

-- CreateIndex
CREATE INDEX "DatabaseView_databaseId_idx" ON "DatabaseView"("databaseId");

-- CreateIndex
CREATE UNIQUE INDEX "DatabaseView_databaseId_name_key" ON "DatabaseView"("databaseId", "name");

-- CreateIndex
CREATE INDEX "DatabaseViewCol_name_viewId_idx" ON "DatabaseViewCol"("name", "viewId");

-- CreateIndex
CREATE UNIQUE INDEX "DatabaseViewCol_name_viewId_key" ON "DatabaseViewCol"("name", "viewId");

-- CreateIndex
CREATE INDEX "_KoboFormToWorkspace_B_index" ON "_KoboFormToWorkspace"("B");

-- CreateIndex
CREATE INDEX "_KoboAnswersToHistory_B_index" ON "_KoboAnswersToHistory"("B");

-- CreateIndex
CREATE INDEX "_AccessTokenToWorkspace_B_index" ON "_AccessTokenToWorkspace"("B");

-- CreateIndex
CREATE INDEX "_ProxyToWorkspace_B_index" ON "_ProxyToWorkspace"("B");

-- CreateIndex
CREATE INDEX "_EmailOutBoxToWorkspace_B_index" ON "_EmailOutBoxToWorkspace"("B");

-- AddForeignKey
ALTER TABLE "WorkspaceAccess" ADD CONSTRAINT "WorkspaceAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceAccess" ADD CONSTRAINT "WorkspaceAccess_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KoboServer" ADD CONSTRAINT "KoboServer_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KoboForm" ADD CONSTRAINT "KoboForm_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "KoboServer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KoboForm" ADD CONSTRAINT "KoboForm_activeVersionId_fkey" FOREIGN KEY ("activeVersionId") REFERENCES "FormSchema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSchema" ADD CONSTRAINT "FormSchema_formId_fkey" FOREIGN KEY ("formId") REFERENCES "KoboForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KoboAnswers" ADD CONSTRAINT "KoboAnswers_formId_fkey" FOREIGN KEY ("formId") REFERENCES "KoboForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KoboAnswersHistory" ADD CONSTRAINT "KoboAnswersHistory_formId_fkey" FOREIGN KEY ("formId") REFERENCES "KoboForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureAccess" ADD CONSTRAINT "FeatureAccess_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureAccess" ADD CONSTRAINT "FeatureAccess_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupItem" ADD CONSTRAINT "GroupItem_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProxyUsage" ADD CONSTRAINT "ProxyUsage_proxyId_fkey" FOREIGN KEY ("proxyId") REFERENCES "Proxy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatabaseViewCol" ADD CONSTRAINT "DatabaseViewCol_viewId_fkey" FOREIGN KEY ("viewId") REFERENCES "DatabaseView"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KoboFormToWorkspace" ADD CONSTRAINT "_KoboFormToWorkspace_A_fkey" FOREIGN KEY ("A") REFERENCES "KoboForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KoboFormToWorkspace" ADD CONSTRAINT "_KoboFormToWorkspace_B_fkey" FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KoboAnswersToHistory" ADD CONSTRAINT "_KoboAnswersToHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "KoboAnswers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KoboAnswersToHistory" ADD CONSTRAINT "_KoboAnswersToHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "KoboAnswersHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccessTokenToWorkspace" ADD CONSTRAINT "_AccessTokenToWorkspace_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessToken"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccessTokenToWorkspace" ADD CONSTRAINT "_AccessTokenToWorkspace_B_fkey" FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProxyToWorkspace" ADD CONSTRAINT "_ProxyToWorkspace_A_fkey" FOREIGN KEY ("A") REFERENCES "Proxy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProxyToWorkspace" ADD CONSTRAINT "_ProxyToWorkspace_B_fkey" FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailOutBoxToWorkspace" ADD CONSTRAINT "_EmailOutBoxToWorkspace_A_fkey" FOREIGN KEY ("A") REFERENCES "EmailOutBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailOutBoxToWorkspace" ADD CONSTRAINT "_EmailOutBoxToWorkspace_B_fkey" FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
