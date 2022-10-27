import HttpException from "exceptions/HttpException";

class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, "Wrong credentials provided");
  }
}

export default WrongCredentialsException;
