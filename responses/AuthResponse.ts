import { Expose, Transform, plainToInstance } from 'class-transformer';
import { User } from '../entities/User';

export class LoginResponse {
  token: string;

  @Expose()
  user: Omit<User, 'password'>;

  constructor(token: string, user: Omit<User, 'password'>) {
    this.token = token;
    this.user = plainToInstance(User, {
      ...user,
      _id: user._id.toString(),
    });
  }
}

export class RegisterResponse {
  token: string;

  @Expose()
  user: Omit<User, 'password'>;

  constructor(token: string, user: Omit<User, 'password'>) {
    this.token = token;
    this.user = plainToInstance(User, {
      ...user,
      _id: user._id.toString(),
    });
  }
}
