import express from "express";
import PokeTrainerService from "pokeTrainer/pokeTrainer.service";

class PokeTrainerController {
  public path = "/poke-trainers";
  public router = express.Router();
  public pokeTrainerService = new PokeTrainerService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.pokeTrainerService.getPokeTrainer);
    this.router.post(this.path, this.pokeTrainerService.createPokeTrainer);
    this.router.patch(
      `${this.path}/:id`,
      this.pokeTrainerService.updatePokeballs
    );
  }
}

export default PokeTrainerController;
