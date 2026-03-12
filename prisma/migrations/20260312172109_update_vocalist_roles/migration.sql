/*
  Warnings:

  - The values [VOCALIST] on the enum `VolunteerRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VolunteerRole_new" AS ENUM ('GUITARIST', 'PIANIST', 'AUX_KEYS', 'DRUMMER', 'LEAD_VOCALIST', 'BGVS', 'BASSIST', 'SOUND_TECH', 'USHER', 'GREETER');
ALTER TABLE "Membership" ALTER COLUMN "volunteerRoles" TYPE "VolunteerRole_new"[] USING ("volunteerRoles"::text::"VolunteerRole_new"[]);
ALTER TABLE "Invitation" ALTER COLUMN "volunteerRoles" TYPE "VolunteerRole_new"[] USING ("volunteerRoles"::text::"VolunteerRole_new"[]);
ALTER TABLE "EventAssignment" ALTER COLUMN "role" TYPE "VolunteerRole_new" USING ("role"::text::"VolunteerRole_new");
ALTER TYPE "VolunteerRole" RENAME TO "VolunteerRole_old";
ALTER TYPE "VolunteerRole_new" RENAME TO "VolunteerRole";
DROP TYPE "public"."VolunteerRole_old";
COMMIT;
