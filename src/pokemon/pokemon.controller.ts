import express from "express";
import RequestWithUser from "interfaces/requestWithUser";
import authMiddleware from "middleware/authMiddleware";
import PokemonService from "pokemon/pokemon.service";
import { createPokemonSchema } from "validation/pokemon/createPokemonSchema";
import validate from "validation/validation";
import { CreatePokemonDto } from "./pokemon.interface";

class PokemonController {
  public path = "/pokemons";
  public router = express.Router();
  public pokemonService = new PokemonService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path,
      validate(createPokemonSchema),
      authMiddleware,
      this.createPokemon
    );
    this.router.patch(`${this.path}/:id`, this.updatePokemonHp);
  }

  private createPokemon = async (
    request: RequestWithUser,
    response: express.Response
  ) => {
    const pokemonData: CreatePokemonDto = request.body;
    const pokemon = await this.pokemonService.createPokemon(pokemonData);

    return response.json(pokemon);
  };

  private updatePokemonHp = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = +request.params.id;
    const hp = +request.body.hp;
    const updatedPokemon = await this.pokemonService.updatePokemonHp(id, hp);

    return response.json(updatedPokemon);
  };
}

export default PokemonController;
