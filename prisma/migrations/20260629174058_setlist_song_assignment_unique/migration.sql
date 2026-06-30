-- CreateTable
CREATE TABLE "SetlistSongAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "setlistSongId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SetlistSongAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SetlistSongAssignment_userId_idx" ON "SetlistSongAssignment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SetlistSongAssignment_setlistSongId_userId_key" ON "SetlistSongAssignment"("setlistSongId", "userId");

-- AddForeignKey
ALTER TABLE "SetlistSongAssignment" ADD CONSTRAINT "SetlistSongAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetlistSongAssignment" ADD CONSTRAINT "SetlistSongAssignment_setlistSongId_fkey" FOREIGN KEY ("setlistSongId") REFERENCES "SetlistSong"("id") ON DELETE CASCADE ON UPDATE CASCADE;
