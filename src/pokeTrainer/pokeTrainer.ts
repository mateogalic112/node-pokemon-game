import express from "express";
import { PrismaClient } from "@prisma/client";

class PokeTrainerController {
  public path = "/poke-trainers";
  public router = express.Router();
  public prisma = new PrismaClient();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.getPokeTrainer);
    this.router.post(this.path, this.createPokeTrainer);
    this.router.patch(`${this.path}/:id`, this.updatePokeballs);
  }

  private getPokeTrainer = async (
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

  private updatePokeballs = async (
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

  private createPokeTrainer = async (
    request: express.Request,
    response: express.Response
  ) => {
    const pokeTrainer = await this.prisma.pokeTrainer.create({
      data: request.body,
    });

    return response.json(pokeTrainer);
  };
}

export default PokeTrainerController;
