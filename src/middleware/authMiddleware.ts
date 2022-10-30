import AuthenticationTokenMissingException from "exceptions/user/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "exceptions/user/WrongAuthenticationTokenException";
import { Request, Response, NextFunction } from "express";
import RequestWithUser from "interfaces/requestWithUser";
import { DataStoredInToken } from "user/user.interface";
import jwt from "jsonwebtoken";
import UserService from "user/user.service";

async function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const userService = new UserService();

  const requestWithUser = request as Request & RequestWithUser;
  const cookies = requestWithUser.cookies;
  if (!(cookies && cookies.Authorization)) {
    return next(new AuthenticationTokenMissingException());
  }

  try {
    const secret = process.env.JWT_SECRET;
    const verificationResponse = jwt.verify(
      cookies.Authorization,
      secret
    ) as DataStoredInToken;

    const id = verificationResponse._id;
    const user = await userService.findUserById(id);
    if (!user) {
      return next(new WrongAuthenticationTokenException());
    }
    requestWithUser.user = user;
    next();
  } catch (error) {
    return next(new WrongAuthenticationTokenException());
  }
}

export default authMiddleware;
