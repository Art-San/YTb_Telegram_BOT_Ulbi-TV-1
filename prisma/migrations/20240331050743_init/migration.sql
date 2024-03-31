-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "chatId" TEXT NOT NULL,
    "right" INTEGER NOT NULL DEFAULT 0,
    "wrong" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_chatId_key" ON "User"("chatId");
