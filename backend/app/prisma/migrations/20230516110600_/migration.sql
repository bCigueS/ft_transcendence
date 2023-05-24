-- DropForeignKey
ALTER TABLE "following" DROP CONSTRAINT "following_followerId_fkey";

-- DropForeignKey
ALTER TABLE "following" DROP CONSTRAINT "following_followingId_fkey";

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
