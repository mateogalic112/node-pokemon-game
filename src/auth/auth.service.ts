import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  DataStoredInToken,
  RegisterUserDto,
  TokenData,
} from "users/user.interface";
import jwt from "jsonwebtoken";
import UserService from "users/user.service";

class AuthService {
  public prisma = new PrismaClient();
  public userService = new UserService();

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

  public async registerUser(userData: RegisterUserDto) {
    const hashedPassword = await this.hashPassword(userData.password);
    const createdUser = await this.prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
    });
    createdUser.password = undefined;
    return createdUser;
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
