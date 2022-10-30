export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface DataStoredInToken {
  _id: number;
}

export interface AuthData {
  userId: number;
  trainerId: number;
  username: string;
}
