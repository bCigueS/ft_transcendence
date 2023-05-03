-- CreateTable
CREATE TABLE "blocked" (
    "id" SERIAL NOT NULL,
    "MyId" INTEGER NOT NULL,
    "blockedId" INTEGER NOT NULL,

    CONSTRAINT "blocked_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_MyId_fkey" FOREIGN KEY ("MyId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
