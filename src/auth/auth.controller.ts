import UserWithThatEmailAlreadyExistsException from "exceptions/user/UserWithThatEmailAlreadyExistsException";
import WrongCredentialsException from "exceptions/user/WrongCredentialsException";
import express, { CookieOptions } from "express";
import Controller from "interfaces/controller.interface";
import RequestWithUser from "interfaces/requestWithUser";
import authMiddleware from "middleware/authMiddleware";
import { LoginUserDto, RegisterUserDto } from "user/user.interface";
import UserService from "user/user.service";
import { loginUserSchema } from "validation/user/loginUserSchema";
import { registerUserSchema } from "validation/user/registerUserSchema";
import validate from "validation/validation";
import AuthService from "./auth.service";

class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();
  public authService = new AuthService();
  public userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validate(registerUserSchema),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      validate(loginUserSchema),
      this.login
    );
    this.router.get(`${this.path}/isLoggedIn`, authMiddleware, this.isLoggedIn);
    this.router.post(`${this.path}/logout`, this.logout);
  }

  private register = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: RegisterUserDto = request.body;
    if (await this.authService.checkIfEmailAlreadyExists(userData.email)) {
      return next(new UserWithThatEmailAlreadyExistsException());
    }

    const registeredUser = await this.authService.registerUser(userData);
    const tokenData = this.authService.createToken(registeredUser.userId);

    response.cookie("Authorization", tokenData, this.authCookieOptions);
    return response.json(registeredUser);
  };

  private login = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const loginData: LoginUserDto = request.body;
    const user = await this.userService.findUserByEmail(loginData.email);
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

    const loggedUser = await this.authService.loginUser(user.id);
    const tokenData = this.authService.createToken(user.id);

    response.cookie("Authorization", tokenData, this.authCookieOptions);
    return response.json(loggedUser);
  };

  private isLoggedIn = async (
    request: express.Request,
    response: express.Response
  ) => {
    const requestWithUser = request as Request & RequestWithUser;
    const loggedUser = await this.authService.loginUser(
      requestWithUser.user.id
    );
    return response.json(loggedUser);
  };

  private logout = (request: express.Request, response: express.Response) => {
    response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    return response.json(200);
  };

  private authCookieOptions: CookieOptions = {
    maxAge: 5 * 60 * 60 * 1000, // 5 hours
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
}

export default AuthController;
