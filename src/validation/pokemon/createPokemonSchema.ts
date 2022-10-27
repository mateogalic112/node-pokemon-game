import { body } from "express-validator";

export const createPokemonSchema = [
  body("pokemonID").isInt(),
  body("hp").isInt(),
  body("pokeTrainerId").isInt(),
];
