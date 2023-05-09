-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('PLAYER', 'COMPUTER');

-- CreateEnum
CREATE TYPE "GameState" AS ENUM ('PENDING', 'PLAYING', 'FINISHED');

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "GameType" NOT NULL,
    "level" INTEGER NOT NULL,
    "state" "GameState" NOT NULL,
    "winnerId" INTEGER,
    "scorePlayer1" INTEGER NOT NULL DEFAULT 0,
    "scorePlayer2" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGame" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerIndex" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserGame_pkey" PRIMARY KEY ("userId","gameId")
);

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
