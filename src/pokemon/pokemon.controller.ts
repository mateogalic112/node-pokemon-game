import express from "express";
import PokemonService from "pokemon/pokemon.service";

class PokemonController {
  public path = "/pokemons";
  public router = express.Router();
  public pokemonService = new PokemonService();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.pokemonService.createPokemon);
    this.router.patch(`${this.path}/:id`, this.pokemonService.updatePokemonHp);
  }
}

export default PokemonController;
