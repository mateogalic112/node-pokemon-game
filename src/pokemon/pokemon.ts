import express from "express";
import { PrismaClient } from "@prisma/client";

class PokemonController {
  public path = "/pokemons";
  public router = express.Router();
  public prisma = new PrismaClient();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPokemons);
    this.router.post(this.path, this.createPokemon);
    this.router.patch(`${this.path}/:id`, this.updatePokemonHp);
  }

  private getAllPokemons = async (
    request: express.Request,
    response: express.Response
  ) => {
    const pokemon = await this.prisma.pokemon.findMany();
    return response.json(pokemon);
  };

  private createPokemon = async (
    request: express.Request,
    response: express.Response
  ) => {
    const pokemon = await this.prisma.pokemon.create({
      data: request.body,
    });

    return response.json(pokemon);
  };

  private updatePokemonHp = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = +request.params.id;
    const hp = +request.body.hp;
    const updatedPokemon = await this.prisma.pokemon.update({
      where: { id },
      data: { hp },
    });

    return response.json(updatedPokemon);
  };
}

export default PokemonController;
