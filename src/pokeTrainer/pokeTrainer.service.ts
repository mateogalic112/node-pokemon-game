import { PrismaClient } from "@prisma/client";
import express from "express";

class PokeTrainerService {
  public prisma = new PrismaClient();

  public getPokeTrainer = async (
    request: express.Request,
    response: express.Response
  ) => {
    const pokeTrainer = await this.prisma.pokeTrainer.findFirst({
      where: {
        id: +request.params.id,
      },
      include: {
        pokemons: true,
      },
    });

    return response.json(pokeTrainer);
  };

  public updatePokeballs = async (
    request: express.Request,
    response: express.Response
  ) => {
    const updatedTrainer = await this.prisma.pokeTrainer.update({
      where: {
        id: +request.params.id,
      },
      data: {
        pokeballs: +request.body.pokeballs,
      },
    });

    return response.json(updatedTrainer);
  };

  public createPokeTrainer = async (
    request: express.Request,
    response: express.Response
  ) => {
    const pokeTrainer = await this.prisma.pokeTrainer.create({
      data: request.body,
    });

    return response.json(pokeTrainer);
  };
}

export default PokeTrainerService;
