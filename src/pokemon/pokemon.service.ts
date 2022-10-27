import express from "express";
import { PrismaClient } from "@prisma/client";
import RequestWithUser from "interfaces/requestWithUser";
import { CreatePokemonDto } from "./pokemon.interface";

class PokemonService {
  private prisma = new PrismaClient();

  public createPokemon = async (pokemonData: CreatePokemonDto) => {
    const pokemon = await this.prisma.pokemon.create({
      data: pokemonData,
    });

    return pokemon;
  };

  public updatePokemonHp = async (id: number, hp: number) => {
    const updatedPokemon = await this.prisma.pokemon.update({
      where: { id },
      data: { hp },
    });

    return updatedPokemon;
  };
}

export default PokemonService;
