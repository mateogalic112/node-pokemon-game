/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `PokeTrainer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `PokeTrainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PokeTrainer" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username";

-- CreateIndex
CREATE UNIQUE INDEX "PokeTrainer_userId_key" ON "PokeTrainer"("userId");

-- AddForeignKey
ALTER TABLE "PokeTrainer" ADD CONSTRAINT "PokeTrainer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
