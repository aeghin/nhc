-- AlterTable
ALTER TABLE "EventAssignment" ADD COLUMN     "autoAssigned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "smartSchedulingEnabled" BOOLEAN NOT NULL DEFAULT false;
