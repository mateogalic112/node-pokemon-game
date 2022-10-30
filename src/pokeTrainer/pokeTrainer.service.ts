import { PrismaClient } from "@prisma/client";
import { CreatePokeTrainerDto } from "./pokeTrainer.interface";

class PokeTrainerService {
  private prisma = new PrismaClient();

  public getPokeTrainer = async (id: number) => {
    const pokeTrainer = await this.prisma.pokeTrainer.findFirst({
      where: {
        id,
      },
      include: {
        pokemons: true,
      },
    });

    return pokeTrainer;
  };

  public getPokeTrainerByUserId = async (userId: number) => {
    const pokeTrainer = await this.prisma.pokeTrainer.findFirst({
      where: {
        userId,
      },
      include: {
        pokemons: true,
      },
    });

    return pokeTrainer;
  };

  public updatePokeballs = async (id: number, pokeballs: number) => {
    const updatedTrainer = await this.prisma.pokeTrainer.update({
      where: {
        id,
      },
      data: {
        pokeballs,
      },
    });

    return updatedTrainer;
  };

  public createPokeTrainer = async (pokeTrainerData: CreatePokeTrainerDto) => {
    const pokeTrainer = await this.prisma.pokeTrainer.create({
      data: pokeTrainerData,
    });

    return pokeTrainer;
  };
}

export default PokeTrainerService;
