import { body } from "express-validator";

export const registerUserSchema = [
  body("username")
    .isLength({ min: 4, max: 16 })
    .withMessage("Username must be at least 4 and no more than 16 characters"),
  body("email").isEmail().withMessage("Incorrect email"),
  body("password").isLength({ min: 4 }).withMessage("Password is too short"),
];
