export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataStoredInToken {
  _id: number;
}
