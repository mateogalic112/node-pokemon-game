import { Pool } from "pg";
import { Trainer } from "./trainers.interface";

export class TrainerService {
  constructor(private pool: Pool) {}

  public getTrainer = async (id: number) => {
    const pokeTrainer = await this.pool.query<Trainer>(
      `
      SELECT * FROM trainers WHERE id = $1;
      `,
      [id]
    );

    return pokeTrainer.rows[0];
  };

  public updatePokeballs = async (id: number, pokeballs: number) => {
    const updatedTrainer = await this.pool.query<Trainer>(
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

  public getTrainerPokemons = async (trainerId: number) => {
    const pokemons = await this.pool.query(
      `
      SELECT * FROM pokemons WHERE trainer_id = $1;
      `,
      [trainerId]
    );

    return pokemons.rows;
  };
}
