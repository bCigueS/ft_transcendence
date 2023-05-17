-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_gameId_fkey";

-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_userId_fkey";

-- DropForeignKey
ALTER TABLE "blocked" DROP CONSTRAINT "blocked_MyId_fkey";

-- DropForeignKey
ALTER TABLE "blocked" DROP CONSTRAINT "blocked_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_winnerId_fkey";

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
