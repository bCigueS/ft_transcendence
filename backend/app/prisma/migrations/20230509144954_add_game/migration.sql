/*
  Warnings:

  - You are about to drop the column `scorePlayer1` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `scorePlayer2` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserGame" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "games" DROP COLUMN "scorePlayer1",
DROP COLUMN "scorePlayer2";
