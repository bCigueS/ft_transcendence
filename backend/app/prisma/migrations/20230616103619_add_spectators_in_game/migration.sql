/*
  Warnings:

  - You are about to drop the column `socketIds` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "games" DROP COLUMN "socketIds",
ADD COLUMN     "playersocketIds" TEXT[],
ADD COLUMN     "spectatorSocketIds" TEXT[];

-- CreateTable
CREATE TABLE "SpectatorGame" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "SpectatorGame_pkey" PRIMARY KEY ("userId","gameId")
);

-- AddForeignKey
ALTER TABLE "SpectatorGame" ADD CONSTRAINT "SpectatorGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpectatorGame" ADD CONSTRAINT "SpectatorGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
