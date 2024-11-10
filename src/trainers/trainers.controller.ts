import { TrainerService } from "./trainers.service";
import { Controller } from "interfaces/controller.interface";
import { Request, Response, NextFunction } from "express";
import authMiddleware from "middleware/auth.middleware";
import validationMiddleware from "middleware/validation.middleware";
import { updatePokeballsSchema } from "./trainers.validation";

export class TrainerController extends Controller {
  constructor(private trainerService: TrainerService) {
    super("/trainers");
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.get(`${this.path}/:id`, authMiddleware, this.getTrainer);
    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(updatePokeballsSchema),
      this.updatePokeballs
    );
    this.router.get(`${this.path}/:trainerId/pokemons`, authMiddleware, this.getTrainerPokemons);
  }

  private getTrainer = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = +request.params.id;
      const trainer = await this.trainerService.getTrainer(id);
      response.json({ data: trainer });
    } catch (error) {
      next(error);
    }
  };

  private updatePokeballs = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = +request.params.id;
      const updatedTrainer = await this.trainerService.updatePokeballs(id, request.body.pokeballs);
      response.json({ data: updatedTrainer });
    } catch (error) {
      next(error);
    }
  };

  private getTrainerPokemons = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const trainerId = +request.params.trainerId;
      const pokemons = await this.trainerService.getTrainerPokemons(trainerId);
      response.json({ data: pokemons });
    } catch (error) {
      next(error);
    }
  };
}
