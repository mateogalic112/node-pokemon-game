import HttpException from "../HttpException";

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor() {
    super(400, "User with that email already exists!");
  }
}

export default UserWithThatEmailAlreadyExistsException;
