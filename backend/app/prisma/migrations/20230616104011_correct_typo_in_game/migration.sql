/*
  Warnings:

  - You are about to drop the column `playersocketIds` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "games" DROP COLUMN "playersocketIds",
ADD COLUMN     "playerSocketIds" TEXT[];
