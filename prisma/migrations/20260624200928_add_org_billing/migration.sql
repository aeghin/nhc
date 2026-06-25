-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "entitlements" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_stripeCustomerId_key" ON "Organization"("stripeCustomerId");
