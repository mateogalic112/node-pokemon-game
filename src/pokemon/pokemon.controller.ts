import { Request, Response, NextFunction } from "express";
import authMiddleware from "middleware/auth.middleware";
import validationMiddleware from "middleware/validation.middleware";
import { createPokemonSchema, updatePokemonHPSchema } from "./pokemon.validation";
import { PokemonService } from "./pokemon.service";
import { Controller } from "interfaces/controller.interface";

export class PokemonController extends Controller {
  constructor(private pokemonService: PokemonService) {
    super("/pokemons");
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.get(`${this.path}/:trainerId`, authMiddleware, this.getPokemonsByTrainer);
    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(createPokemonSchema),
      this.createPokemon
    );
    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(updatePokemonHPSchema),
      this.updatePokemonHp
    );
  }

  private getPokemonsByTrainer = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const trainerId = +request.params.trainerId;
      const pokemons = await this.pokemonService.getPokemonsByTrainer(trainerId);
      response.json({ data: pokemons });
    } catch (error) {
      next(error);
    }
  };

  private createPokemon = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const pokemon = await this.pokemonService.createPokemon(request.body);
      response.status(201).json({ data: pokemon });
    } catch (error) {
      next(error);
    }
  };

  private updatePokemonHp = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = +request.params.id;
      const updatedPokemon = await this.pokemonService.updatePokemonHp(id, request.body.hp);
      response.json({ data: updatedPokemon });
    } catch (error) {
      next(error);
    }
  };
}
