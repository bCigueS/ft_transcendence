/*
  Warnings:

  - Added the required column `MyId` to the `friends` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_friendId_fkey";

-- AlterTable
ALTER TABLE "friends" ADD COLUMN     "MyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_MyId_fkey" FOREIGN KEY ("MyId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
