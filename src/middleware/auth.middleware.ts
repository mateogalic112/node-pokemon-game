import { Request, Response, NextFunction } from "express";
import pool from "config/database";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "errors/unauthorized.error";
import { env } from "config/env";

async function authMiddleware(request: Request, _: Response, next: NextFunction) {
  const token = request.cookies.Authentication;
  if (!token) return next(new UnauthorizedError());

  const decoded = jwt.verify(token, env.JWT_SECRET) as { _id: number };
  if (!decoded._id) return next(new UnauthorizedError());

  try {
    const result = await pool.query("SELECT id FROM trainers WHERE id = $1", [decoded._id]);
    if (result.rows.length === 0) return next(new UnauthorizedError());

    request.userId = decoded._id;

    next();
  } catch (error) {
    next(new UnauthorizedError());
  }
}

export default authMiddleware;
