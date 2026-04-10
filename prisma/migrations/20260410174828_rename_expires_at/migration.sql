/*
  Warnings:

  - You are about to drop the column `ExpiresAt` on the `EventAssignment` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `EventAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventAssignment" DROP COLUMN "ExpiresAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
