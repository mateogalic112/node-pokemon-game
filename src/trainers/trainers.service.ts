import { Pool } from "pg";
import { Trainer } from "./trainers.interface";

export class TrainerService {
  constructor(private pool: Pool) {}

  public getTrainer = async (id: number) => {
    const pokeTrainer = await this.pool.query<Trainer>(
      `
      SELECT 
        t.id,
        t.email,
        t.name,
        t.pokeballs,
        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'pokemon_id', p.pokemon_id,
              'hp', p.hp,
              'trainer_id', p.trainer_id
            )
          ) FILTER (WHERE p.id IS NOT NULL), 
          '[]'
        ) AS pokemons
      FROM trainers t
      LEFT JOIN pokemons p ON t.id = p.trainer_id
      WHERE t.id = $1
      GROUP BY t.id;
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
}
