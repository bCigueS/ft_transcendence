/*
  Warnings:

  - You are about to drop the column `MyId` on the `following` table. All the data in the column will be lost.
  - You are about to drop the column `friendId` on the `following` table. All the data in the column will be lost.
  - Added the required column `followerId` to the `following` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingId` to the `following` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "following" DROP CONSTRAINT "following_MyId_fkey";

-- DropForeignKey
ALTER TABLE "following" DROP CONSTRAINT "following_friendId_fkey";

-- AlterTable
ALTER TABLE "following" DROP COLUMN "MyId",
DROP COLUMN "friendId",
ADD COLUMN     "followerId" INTEGER NOT NULL,
ADD COLUMN     "followingId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
