import express from "express";
import { TrainerService } from "./trainers.service";

export class TrainerController {
  public path = "/trainers";
  public router = express.Router();

  constructor(private trainerService: TrainerService) {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.getTrainer);
    this.router.patch(`${this.path}/:id`, this.updatePokeballs);
  }

  private getTrainer = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = +request.params.id;
    const pokeTrainer = await this.trainerService.getPokeTrainer(id);

    return response.json(pokeTrainer);
  };

  private updatePokeballs = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = +request.params.id;
    const pokeballs = +request.body.pokeballs;

    const updatedTrainer = await this.trainerService.updatePokeballs(
      id,
      pokeballs
    );

    return response.json(updatedTrainer);
  };
}
