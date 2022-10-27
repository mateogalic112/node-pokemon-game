import { body } from "express-validator";

export const loginUserSchema = [
  body("email").isEmail().withMessage("Incorrect email"),
  body("password").isLength({ min: 4 }).withMessage("Password is too short"),
];
