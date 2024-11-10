import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string().min(3)
  })
});
export type RegisterPayload = z.infer<typeof registerSchema>["body"];

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
});
export type LoginPayload = z.infer<typeof loginSchema>["body"];
