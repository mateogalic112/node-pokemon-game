import UserWithThatEmailAlreadyExistsException from "exceptions/user/UserWithThatEmailAlreadyExistsException";
import express from "express";
import Controller from "interfaces/controller.interface";
import { RegisterUserDto } from "users/user.interface";
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
    // this.router.post(`${this.path}/login`, this.login);
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
    return response.send(registeredUser);
  };

  // private login = async (
  //   request: express.Request,
  //   response: express.Response,
  //   next: express.NextFunction
  // ) => {
  //   const logInData: LogInDto = request.body;
  //   const user = await this.user.findOne({ email: logInData.email });
  //   if (user) {
  //     const isPasswordMatching = await bcrypt.compare(
  //       logInData.password,
  //       user.password
  //     );
  //     if (isPasswordMatching) {
  //       user.password = undefined;
  //       response.send(user);
  //     } else {
  //       next(new WrongCredentialsException());
  //     }
  //   } else {
  //     next(new WrongCredentialsException());
  //   }
  // };
}

export default AuthController;
