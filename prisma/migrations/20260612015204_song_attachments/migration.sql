-- CreateTable
CREATE TABLE "SongAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "songId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SongAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SongAttachment_key_key" ON "SongAttachment"("key");

-- CreateIndex
CREATE INDEX "SongAttachment_songId_idx" ON "SongAttachment"("songId");

-- AddForeignKey
ALTER TABLE "SongAttachment" ADD CONSTRAINT "SongAttachment_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
