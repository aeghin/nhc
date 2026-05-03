-- DropForeignKey
ALTER TABLE "EventAssignment" DROP CONSTRAINT "EventAssignment_organizationId_fkey";

-- AddForeignKey
ALTER TABLE "EventAssignment" ADD CONSTRAINT "EventAssignment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
