import express from "express";
import { PrismaClient } from "@prisma/client";

class PokemonService {
  public prisma = new PrismaClient();

  public createPokemon = async (
    request: express.Request,
    response: express.Response
  ) => {
    const pokemon = await this.prisma.pokemon.create({
      data: request.body,
    });

    return response.json(pokemon);
  };

  public updatePokemonHp = async (
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

export default PokemonService;
