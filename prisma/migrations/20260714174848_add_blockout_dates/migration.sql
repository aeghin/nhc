-- CreateTable
CREATE TABLE "BlockoutDate" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockoutDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlockoutDate_organizationId_endDate_idx" ON "BlockoutDate"("organizationId", "endDate");

-- CreateIndex
CREATE INDEX "BlockoutDate_userId_organizationId_idx" ON "BlockoutDate"("userId", "organizationId");

-- AddForeignKey
ALTER TABLE "BlockoutDate" ADD CONSTRAINT "BlockoutDate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockoutDate" ADD CONSTRAINT "BlockoutDate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
