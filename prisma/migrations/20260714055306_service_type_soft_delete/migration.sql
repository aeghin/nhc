-- AlterTable
ALTER TABLE "ServiceType" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "ServiceType_organizationId_deletedAt_idx" ON "ServiceType"("organizationId", "deletedAt");
