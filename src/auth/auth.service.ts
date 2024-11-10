import bcrypt from "bcrypt";
import { env } from "config/env";
import { BadRequestError } from "errors/bad-request.error";
import { NotFoundError } from "errors/not-found";
import { UnauthorizedError } from "errors/unauthorized.error";
import { CookieOptions } from "express";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { Trainer } from "trainers/trainers.interface";
import { LoginPayload, RegisterPayload } from "./auth.validation";

export class AuthService {
  constructor(private pool: Pool) {}

  public async register(payload: RegisterPayload) {
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const registeredUser = await this.pool.query<Trainer>(
      `
      INSERT INTO trainers (email, password, name)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [payload.email, hashedPassword, payload.name]
    );

    return registeredUser.rows[0];
  }

  public async login(payload: LoginPayload) {
    const user = await this.pool.query<Trainer>(
      `
      SELECT * FROM trainers WHERE email = $1;
      `,
      [payload.email]
    );
    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(payload.password, user.rows[0].password);
    if (!isPasswordCorrect) {
      throw new BadRequestError("Invalid email or password");
    }

    return user.rows[0];
  }

  public async isLoggedIn(userId?: number) {
    if (!userId) {
      throw new UnauthorizedError("User not logged in");
    }

    const user = await this.pool.query<Trainer>(
      `
      SELECT * FROM trainers WHERE id = $1;
      `,
      [userId]
    );

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user.rows[0];
  }

  public createCookieOptions(): CookieOptions {
    return {
      maxAge: 5 * 60 * 60 * 1000, // 5 hours
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    };
  }

  public createToken(userId: number) {
    return jwt.sign({ _id: userId }, env.JWT_SECRET, { expiresIn: 60 * 60 });
  }
}
