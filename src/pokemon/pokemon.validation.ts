import { z } from "zod";

export const createPokemonSchema = z.object({
  body: z.object({
    pokemon_id: z.number(),
    hp: z.number(),
    trainer_id: z.number().optional()
  })
});
export type CreatePokemonPayload = z.infer<typeof createPokemonSchema>["body"];
