/*
  Warnings:

  - Added the required column `ExpiresAt` to the `EventAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventAssignment" ADD COLUMN     "ExpiresAt" TIMESTAMP(3) NOT NULL;
