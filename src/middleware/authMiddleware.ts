import AuthenticationTokenMissingException from "exceptions/user/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "exceptions/user/WrongAuthenticationTokenException";
import { NextFunction } from "express";
import RequestWithUser from "interfaces/requestWithUser";
import { DataStoredInToken } from "users/user.interface";
import jwt from "jsonwebtoken";
import AuthService from "auth/auth.service";

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const authService = new AuthService();

  const cookies = request.cookies;
  if (!(cookies && cookies.Authorization)) {
    next(new AuthenticationTokenMissingException());
  }

  try {
    const secret = process.env.JWT_SECRET;
    const verificationResponse = jwt.verify(
      cookies.Authorization,
      secret
    ) as DataStoredInToken;

    const id = verificationResponse._id;
    const user = await authService.findUserById(id);
    if (!user) {
      next(new WrongAuthenticationTokenException());
    }
    request.user = user;
    next();
  } catch (error) {
    next(new WrongAuthenticationTokenException());
  }
}

export default authMiddleware;
