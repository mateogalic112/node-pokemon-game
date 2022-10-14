/*
  Warnings:

  - You are about to drop the column `height` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the `PokemonMove` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PokemonStat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PokemonType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pokeTrainerId` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pokemonID` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PokemonMove" DROP CONSTRAINT "PokemonMove_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonStat" DROP CONSTRAINT "PokemonStat_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonType" DROP CONSTRAINT "PokemonType_pokemonId_fkey";

-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "height",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "weight",
ADD COLUMN     "hp" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "pokeTrainerId" INTEGER NOT NULL,
ADD COLUMN     "pokemonID" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PokemonMove";

-- DropTable
DROP TABLE "PokemonStat";

-- DropTable
DROP TABLE "PokemonType";

-- CreateTable
CREATE TABLE "PokeTrainer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pokeballs" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "PokeTrainer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_pokeTrainerId_fkey" FOREIGN KEY ("pokeTrainerId") REFERENCES "PokeTrainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
