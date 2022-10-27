import { PrismaClient } from "@prisma/client";

class UserService {
  private prisma = new PrismaClient();

  public async findUserByEmail(email: string) {
    const foundUser = await this.prisma.user.findFirst({
      where: { email },
    });
    return foundUser;
  }

  public async findUserById(id: number) {
    const foundUser = await this.prisma.user.findFirst({
      where: { id },
    });
    return foundUser;
  }
}

export default UserService;
