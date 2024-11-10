import { Request, Response, NextFunction } from "express";
import { Controller } from "interfaces/controller.interface";
import authMiddleware from "middleware/auth.middleware";
import { AuthService } from "./auth.service";
import validationMiddleware from "middleware/validation.middleware";
import { loginSchema, registerSchema } from "./auth.validation";

export class AuthController extends Controller {
  constructor(private authService: AuthService) {
    super("/auth");
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(registerSchema), this.register);
    this.router.post(`${this.path}/login`, validationMiddleware(loginSchema), this.login);
    this.router.get(`${this.path}/me`, authMiddleware, this.isLoggedIn);
    this.router.post(`${this.path}/logout`, authMiddleware, this.logout);
  }

  private register = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const createdUser = await this.authService.register(request.body);
      response.cookie(
        "Authentication",
        this.authService.createToken(createdUser.id),
        this.authService.createCookieOptions()
      );
      response.status(201).json({ data: createdUser });
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
      next(error);
    }
  };

  private isLoggedIn = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const loggedUser = await this.authService.isLoggedIn(request.userId);
      response.json({ data: loggedUser });
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
