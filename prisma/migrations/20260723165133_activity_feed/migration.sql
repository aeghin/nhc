-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('EVENT_CREATED', 'INVITE_SENT', 'INVITE_ACCEPTED', 'INVITE_DECLINED', 'INVITE_CANCELED', 'AUTO_INVITE_SENT', 'MEMBER_REMOVED', 'MEMBER_LEFT', 'ROLE_CHANGED');

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "actorName" TEXT,
    "targetName" TEXT,
    "detail" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_organizationId_createdAt_idx" ON "ActivityLog"("organizationId", "createdAt");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
