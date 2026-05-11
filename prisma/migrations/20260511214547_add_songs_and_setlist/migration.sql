-- CreateEnum
CREATE TYPE "Pitch" AS ENUM ('C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B');

-- CreateEnum
CREATE TYPE "KeyQuality" AS ENUM ('MAJOR', 'MINOR');

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "timeSignature" TEXT NOT NULL,
    "defaultPitch" "Pitch",
    "defaultKeyQuality" "KeyQuality",
    "spotifyUrl" TEXT,
    "youtubeUrl" TEXT,
    "themes" TEXT[],
    "organizationId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetlistSong" (
    "id" TEXT NOT NULL,
    "pitch" "Pitch" NOT NULL,
    "keyQuality" "KeyQuality" NOT NULL,
    "bpm" INTEGER NOT NULL,
    "timeSignature" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SetlistSong_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Song_organizationId_deletedAt_idx" ON "Song"("organizationId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Song_organizationId_title_artist_key" ON "Song"("organizationId", "title", "artist");

-- CreateIndex
CREATE INDEX "SetlistSong_eventId_idx" ON "SetlistSong"("eventId");

-- CreateIndex
CREATE INDEX "SetlistSong_songId_idx" ON "SetlistSong"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "SetlistSong_eventId_songId_key" ON "SetlistSong"("eventId", "songId");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetlistSong" ADD CONSTRAINT "SetlistSong_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetlistSong" ADD CONSTRAINT "SetlistSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
