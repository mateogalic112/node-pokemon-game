import UserWithThatEmailAlreadyExistsException from "exceptions/user/UserWithThatEmailAlreadyExistsException";
import WrongCredentialsException from "exceptions/user/WrongCredentialsException";
import express from "express";
import Controller from "interfaces/controller.interface";
import { LoginUserDto, RegisterUserDto } from "users/user.interface";
import { registerUserSchema } from "validation/user/registerUserSchema";
import validate from "validation/validation";
import AuthService from "./auth.service";

class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();
  public authService = new AuthService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validate(registerUserSchema),
      this.registration
    );
    this.router.post(`${this.path}/login`, this.login);
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: RegisterUserDto = request.body;
    if (await this.authService.checkIfEmailAlreadyExists(userData.email)) {
      return next(new UserWithThatEmailAlreadyExistsException());
    }

    const registeredUser = await this.authService.registerUser(userData);
    const tokenData = this.authService.createToken(registeredUser);
    response.setHeader("Set-Cookie", [
      this.authService.createCookie(tokenData),
    ]);
    return response.send(registeredUser);
  };

  private login = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const loginData: LoginUserDto = request.body;
    const user = await this.authService.findUserByEmail(loginData.email);
    if (!user) {
      return next(new WrongCredentialsException());
    }

    const isPasswordMatching = await this.authService.checkIfPasswordMatch(
      loginData.password,
      user.password
    );
    if (!isPasswordMatching) {
      return next(new WrongCredentialsException());
    }

    user.password = undefined;
    const tokenData = this.authService.createToken(user);
    response.setHeader("Set-Cookie", [
      this.authService.createCookie(tokenData),
    ]);
    return response.send(user);
  };
}

export default AuthController;
