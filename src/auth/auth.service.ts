import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  AuthData,
  DataStoredInToken,
  RegisterUserDto,
  TokenData,
} from "users/user.interface";
import jwt from "jsonwebtoken";
import UserService from "users/user.service";
import PokeTrainerService from "pokeTrainer/pokeTrainer.service";

class AuthService {
  private prisma = new PrismaClient();
  public userService = new UserService();
  public pokeTrainerService = new PokeTrainerService();

  public async registerUser(registerData: RegisterUserDto): Promise<AuthData> {
    const hashedPassword = await this.hashPassword(registerData.password);
    const createdUser = await this.prisma.user.create({
      data: {
        email: registerData.email,
        password: hashedPassword,
      },
    });
    const pokeTrainer = await this.pokeTrainerService.createPokeTrainer({
      userId: createdUser.id,
      name: registerData.username,
    });
    return {
      userId: createdUser.id,
      trainerId: pokeTrainer.id,
      username: pokeTrainer.name,
    };
  }

  public async loginUser(user: User) {
    const pokeTrainer = await this.pokeTrainerService.getPokeTrainerByUserId(
      user.id
    );
    return {
      userId: user.id,
      trainerId: pokeTrainer.id,
      username: pokeTrainer.name,
    };
  }

  public async checkIfEmailAlreadyExists(email: string) {
    if (await this.userService.findUserByEmail(email)) return true;
    return false;
  }

  private async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  public async checkIfPasswordMatch(
    currentPassword: string,
    userPassword: string
  ) {
    const isPasswordMatching = await bcrypt.compare(
      currentPassword,
      userPassword
    );
    return isPasswordMatching;
  }

  public createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user.id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthService;
