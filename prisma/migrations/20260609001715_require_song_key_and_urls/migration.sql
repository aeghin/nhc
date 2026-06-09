/*
  Warnings:

  - Made the column `defaultPitch` on table `Song` required. This step will fail if there are existing NULL values in that column.
  - Made the column `defaultKeyQuality` on table `Song` required. This step will fail if there are existing NULL values in that column.
  - Made the column `spotifyUrl` on table `Song` required. This step will fail if there are existing NULL values in that column.
  - Made the column `youtubeUrl` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "defaultPitch" SET NOT NULL,
ALTER COLUMN "defaultKeyQuality" SET NOT NULL,
ALTER COLUMN "spotifyUrl" SET NOT NULL,
ALTER COLUMN "youtubeUrl" SET NOT NULL;
