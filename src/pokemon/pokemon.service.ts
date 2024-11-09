import { Pokemon } from "./pokemon.interface";
import { Pool } from "pg";
import { CreatePokemonPayload } from "./pokemon.validation";

class PokemonService {
  constructor(private pool: Pool) {}

  public createPokemon = async (payload: CreatePokemonPayload) => {
    const pokemon = await this.pool.query<Pokemon>(
      `
      INSERT INTO pokemons (pokemon_id, hp, trainer_id)
      `,
      [payload.pokemon_id, payload.hp, payload.trainer_id]
    );

    return pokemon.rows[0];
  };

  public updatePokemonHp = async (id: number, hp: number) => {
    const updatedPokemon = await this.pool.query<Pokemon>(
      `
      UPDATE pokemons
      SET hp = $1
      WHERE id = $2
      RETURNING *;
      `,
      [hp, id]
    );

    return updatedPokemon.rows[0];
  };
}

export default PokemonService;
