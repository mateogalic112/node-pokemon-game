import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { RegisterUserDto } from "users/user.interface";

class AuthService {
  public prisma = new PrismaClient();

  public async findUserByEmail(email: string) {
    const foundUser = await this.prisma.user.findFirst({
      where: { email },
    });
    return foundUser;
  }

  public async checkIfEmailAlreadyExists(email: string) {
    if (await this.findUserByEmail(email)) return true;
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
}

export default AuthService;
