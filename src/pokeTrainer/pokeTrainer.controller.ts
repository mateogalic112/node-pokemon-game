import express from "express";
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
}

export default PokeTrainerController;
