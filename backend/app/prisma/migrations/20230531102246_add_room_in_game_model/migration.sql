/*
  Warnings:

  - You are about to drop the column `playerIndex` on the `UserGame` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `games` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[room]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `room` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGame" DROP COLUMN "playerIndex";

-- AlterTable
ALTER TABLE "games" DROP COLUMN "duration",
ADD COLUMN     "room" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "games_room_key" ON "games"("room");
