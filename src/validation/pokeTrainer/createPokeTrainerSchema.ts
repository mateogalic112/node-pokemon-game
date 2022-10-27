import { body } from "express-validator";

export const createPokeTrainerSchema = [
  body("name").isLength({ min: 4 }).withMessage("Name too short"),
];
