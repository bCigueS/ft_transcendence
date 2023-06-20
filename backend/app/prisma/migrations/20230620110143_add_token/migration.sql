-- AlterTable
ALTER TABLE "users" ADD COLUMN     "secert" TEXT,
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "token" TEXT;
