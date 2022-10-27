import HttpException from "exceptions/HttpException";

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, "Wrong authentication token");
  }
}

export default WrongAuthenticationTokenException;
