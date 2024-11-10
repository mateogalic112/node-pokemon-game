import { z } from "zod";

export const updatePokeballsSchema = z.object({
  body: z.object({
    pokeballs: z.number()
  })
});
