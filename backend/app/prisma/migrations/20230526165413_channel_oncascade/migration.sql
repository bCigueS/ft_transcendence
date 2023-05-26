-- DropForeignKey
ALTER TABLE "ChannelMembership" DROP CONSTRAINT "ChannelMembership_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelMembership" DROP CONSTRAINT "ChannelMembership_userId_fkey";

-- AddForeignKey
ALTER TABLE "ChannelMembership" ADD CONSTRAINT "ChannelMembership_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMembership" ADD CONSTRAINT "ChannelMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
