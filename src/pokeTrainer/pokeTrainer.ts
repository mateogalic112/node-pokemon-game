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
    this.router.get(this.path, this.getAllPokeTrainers);
    this.router.post(this.path, this.createPokeTrainer);
  }

  private getAllPokeTrainers = async (
    request: express.Request,
    response: express.Response
  ) => {
    const pokeTrainers = await this.prisma.pokeTrainer.findMany();
    response.send(pokeTrainers);
  };

  private createPokeTrainer = async (
    request: express.Request,
    response: express.Response
  ) => {
    const pokeTrainer = await this.prisma.pokeTrainer.create({
      data: request.body,
    });

    response.send(pokeTrainer);
  };
}

export default PokeTrainerController;
