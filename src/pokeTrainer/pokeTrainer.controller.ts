import express from "express";
import { createPokeTrainerSchema } from "validation/pokeTrainer/createPokeTrainerSchema";
import validate from "validation/validation";
import { CreatePokeTrainerDto } from "./pokeTrainer.interface";
import PokeTrainerService from "./pokeTrainer.service";

class PokeTrainerController {
  public path = "/poke-trainers";
  public router = express.Router();
  public pokeTrainerService = new PokeTrainerService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.getPokeTrainer);
    this.router.post(
      this.path,
      validate(createPokeTrainerSchema),
      this.createPokeTrainer
    );
    this.router.patch(`${this.path}/:id`, this.updatePokeballs);
  }

  private getPokeTrainer = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = +request.params.id;
    const pokeTrainer = await this.pokeTrainerService.getPokeTrainer(id);

    return response.json(pokeTrainer);
  };

  private updatePokeballs = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = +request.params.id;
    const pokeballs = +request.body.pokeballs;

    const updatedTrainer = await this.pokeTrainerService.updatePokeballs(
      id,
      pokeballs
    );

    return response.json(updatedTrainer);
  };

  private createPokeTrainer = async (
    request: express.Request,
    response: express.Response
  ) => {
    const pokeTrainerData: CreatePokeTrainerDto = request.body;
    const newPokeTrainer = await this.pokeTrainerService.createPokeTrainer(
      pokeTrainerData
    );

    return response.json(newPokeTrainer);
  };
}

export default PokeTrainerController;
