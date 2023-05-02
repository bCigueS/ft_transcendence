/*
  Warnings:

  - Made the column `avatar` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar" SET NOT NULL,
ALTER COLUMN "avatar" DROP DEFAULT,
ALTER COLUMN "avatar" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "friends" (
    "id" SERIAL NOT NULL,
    "friendId" INTEGER NOT NULL,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
