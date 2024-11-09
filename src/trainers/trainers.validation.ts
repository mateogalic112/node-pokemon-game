import { z } from "zod";

export const createTrainerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string().min(3)
  })
});
export type CreateTrainerPayload = z.infer<typeof createTrainerSchema>["body"];

export const loginTrainerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
});
export type LoginTrainerPayload = z.infer<typeof loginTrainerSchema>["body"];

export const updatePokeballsSchema = z.object({
  body: z.object({
    pokeballs: z.number()
  })
});
export type UpdatePokeballsPayload = z.infer<typeof updatePokeballsSchema>["body"];
