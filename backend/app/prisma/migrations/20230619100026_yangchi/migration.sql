-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('PLAYER', 'COMPUTER');

-- CreateEnum
CREATE TYPE "GameState" AS ENUM ('PENDING', 'PLAYING', 'FINISHED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT DEFAULT 'default.jpg',
    "doubleAuth" BOOLEAN NOT NULL DEFAULT false,
    "wins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "following" (
    "id" SERIAL NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "following_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked" (
    "id" SERIAL NOT NULL,
    "MyId" INTEGER NOT NULL,
    "blockedId" INTEGER NOT NULL,

    CONSTRAINT "blocked_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "GameType" NOT NULL,
    "level" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "duration" INTEGER,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGame" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerIndex" INTEGER NOT NULL DEFAULT 1,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserGame_pkey" PRIMARY KEY ("userId","gameId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_MyId_fkey" FOREIGN KEY ("MyId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
