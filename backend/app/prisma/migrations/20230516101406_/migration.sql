/*
  Warnings:

  - You are about to drop the `friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_MyId_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_friendId_fkey";

-- DropTable
DROP TABLE "friends";

-- CreateTable
CREATE TABLE "following" (
    "id" SERIAL NOT NULL,
    "MyId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,

    CONSTRAINT "following_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_MyId_fkey" FOREIGN KEY ("MyId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
