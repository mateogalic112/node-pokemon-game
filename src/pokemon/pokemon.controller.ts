import express from "express";
import { PrismaClient } from "@prisma/client";

class PokemonController {
  public path = "/pokemons";
  public router = express.Router();
  public prisma = new PrismaClient();

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPokemons);
    this.router.post(this.path, this.createPokemon);
  }

  public getAllPokemons = async (
    request: express.Request,
    response: express.Response
  ) => {
    const pokemons = await this.prisma.pokemon.findMany();
    response.send(pokemons);
  };

  public createPokemon = async (
    request: express.Request,
    response: express.Response
  ) => {
    const pokemon = await this.prisma.pokemon.create({
      data: request.body,
    });

    response.send(pokemon);
  };
}

export default PokemonController;
