import { HttpError } from "errors/http.error";
import { NextFunction, Request, Response } from "express";

function errorMiddleware(
  error: HttpError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  response.status(status).send({
    status,
    message
  });
}

export default errorMiddleware;
