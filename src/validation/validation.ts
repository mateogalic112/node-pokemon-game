import express, { NextFunction } from "express";
import { validationResult } from "express-validator";

const validate = (schemas: any[]) => {
  return async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ) => {
    await Promise.all(schemas.map((schema) => schema.run(request)));

    const result = validationResult(request);
    if (result.isEmpty()) {
      return next();
    }

    const errors = result.array();
    return response.send({
      message: "Validation error",
      errors: errors,
    });
  };
};

export default validate;
