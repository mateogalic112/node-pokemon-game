import { Request, Response, NextFunction, Router } from "express";
import { Controller } from "interfaces/controller.interface";
import authMiddleware from "middleware/authMiddleware";
import AuthService from "./auth.service";
import validationMiddleware from "middleware/validation-middleware";
import { createTrainerSchema, loginTrainerSchema } from "trainers/trainers.validation";

class AuthController implements Controller {
  public path = "/auth";
  public router = Router();

  constructor(private authService: AuthService) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(createTrainerSchema),
      this.register
    );
    this.router.post(`${this.path}/login`, validationMiddleware(loginTrainerSchema), this.login);
    this.router.get(`${this.path}/me`, authMiddleware, this.isLoggedIn);
    this.router.post(`${this.path}/logout`, this.logout);
  }

  private register = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const createdTrainer = await this.authService.register(request.body);
      response.cookie(
        "Authentication",
        this.authService.createToken(createdTrainer.id),
        this.authService.createCookieOptions()
      );
      response.status(201).json({ data: createdTrainer });
    } catch (error) {
      next(error);
    }
  };

  private login = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = await this.authService.login(request.body);
      response.cookie(
        "Authentication",
        this.authService.createToken(user.id),
        this.authService.createCookieOptions()
      );
      response.json({ data: user });
    } catch (error) {
      console.log({ error });

      next(error);
    }
  };

  private isLoggedIn = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const loggedUser = await this.authService.isLoggedIn(request.userId);
      response.json(loggedUser);
    } catch (error) {
      next(error);
    }
  };

  private logout = (_: Request, response: Response) => {
    response
      .setHeader("Set-Cookie", ["Authentication=; Max-Age=0; Path=/; HttpOnly"])
      .status(204)
      .end();
  };
}

export default AuthController;
