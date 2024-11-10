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
      const pokeballs = +request.body.pokeballs;
      const updatedTrainer = await this.trainerService.updatePokeballs(id, pokeballs);
      response.json({ data: updatedTrainer });
    } catch (error) {
      next(error);
    }
  };
}
