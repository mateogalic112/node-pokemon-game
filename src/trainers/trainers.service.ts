import { Pool } from "pg";
import { Trainer } from "./trainers.interface";
import { CreateTrainerPayload } from "./trainers.validation";

export class TrainerService {
  constructor(private pool: Pool) {}

  public getPokeTrainer = async (id: number) => {
    const pokeTrainer = await this.pool.query<Trainer>(
      `
      SELECT trainers.*, pokemons.*
      FROM trainers
      LEFT JOIN pokemons ON trainers.id = pokemons.trainer_id
      WHERE trainers.id = $1;
      `,
      [id]
    );

    return pokeTrainer.rows[0];
  };

  public updatePokeballs = async (id: number, pokeballs: number) => {
    const updatedTrainer = await this.pool.query(
      `
      UPDATE trainers
      SET pokeballs = $1
      WHERE id = $2
      RETURNING *;
      `,
      [pokeballs, id]
    );

    return updatedTrainer.rows[0];
  };

  public createPokeTrainer = async (payload: CreateTrainerPayload) => {
    const pokeTrainer = await this.pool.query<Trainer>(
      `
      INSERT INTO trainers (email, password)
      VALUES ($1, $2)
      `,
      [payload.email, payload.password]
    );

    return pokeTrainer.rows[0];
  };
}
