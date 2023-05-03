-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT 'uploads/default.jpg';
