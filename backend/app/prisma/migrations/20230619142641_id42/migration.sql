/*
  Warnings:

  - A unique constraint covering the columns `[id42]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id42` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "id42" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_id42_key" ON "users"("id42");
