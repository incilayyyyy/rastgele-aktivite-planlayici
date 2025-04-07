import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsUniqueEmail } from '../utils/IsUniqueEmail';

export class LoginRequest {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Password is required' })
  password!: string;
}

export class RegisterRequest {
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  // @Validate(IsUniqueEmail, { message: 'Email already in use' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Password is required' })
  password!: string;
}