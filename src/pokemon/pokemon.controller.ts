import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "middleware/authMiddleware";
import validationMiddleware from "middleware/validation-middleware";
import { createPokemonSchema } from "./pokemon.validation";
import PokemonService from "./pokemon.service";

class PokemonController {
  public path = "/pokemons";
  public router = Router();

  constructor(private pokemonService: PokemonService) {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path,
      validationMiddleware(createPokemonSchema),
      authMiddleware,
      this.createPokemon
    );
    this.router.patch(`${this.path}/:id`, authMiddleware, this.updatePokemonHp);
  }

  private createPokemon = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const pokemon = await this.pokemonService.createPokemon(request.body);
      return response.json({ data: pokemon });
    } catch (error) {
      next(error);
    }
  };

  private updatePokemonHp = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = +request.params.id;
      const updatedPokemon = await this.pokemonService.updatePokemonHp(id, request.body.hp);
      return response.json({ data: updatedPokemon });
    } catch (error) {
      next(error);
    }
  };
}

export default PokemonController;
