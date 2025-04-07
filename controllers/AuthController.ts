import {
  JsonController, Body, Post, HttpCode, InternalServerError, NotFoundError, UnauthorizedError, Authorized
} from 'routing-controllers';
import { Service } from 'typedi';
import { UserService } from '../services/UserService';
import { LoginRequest, RegisterRequest } from '../requests/AuthRequest';
import { LoginResponse, RegisterResponse } from '../responses/AuthResponse';
import { Ok, Created } from '../responses/Success';
import { BadRequestError } from '../responses/Errors';
import { Parameter } from '../decorators/Parameter';
import { Description } from '../decorators/Description';

@Service()
@Description("Handles user authentication and registration.")
@JsonController('/auth')
export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  @Post('/login')
  @HttpCode(200)
  @Description("Logs in a user with email and password.")
  @Parameter('email', 'body', 'Email of the user', true)
  @Parameter('password', 'body', 'Password of the user', true)
  async login(@Body() body: LoginRequest): Promise<any> {
    try {
      const { email, password } = body;

      const login = await this.userService.login(email, password);

      if (login instanceof NotFoundError) return new BadRequestError('Invalid email or password');
      if (login instanceof Error) return new InternalServerError('An unexpected error occurred');

      return new Ok(new LoginResponse(login.token, login.user));
    } catch (error) {
      if (error instanceof NotFoundError) return new NotFoundError('Invalid email or password');
      if (error instanceof UnauthorizedError) return new UnauthorizedError('Invalid email or password');

      throw new InternalServerError('An unexpected error occurred');
    }
  }

  @Post('/register')
  @HttpCode(201)
  @Description("Registers a new user with name, email, and password.")
  @Parameter('name', 'body', 'Name of the user', true)
  @Parameter('email', 'body', 'Email of the user', true)
  @Parameter('password', 'body', 'Password of the user', true)
  async register(@Body() body: RegisterRequest): Promise<any> {
    try {
      const { name, email, password } = body;

      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) return new BadRequestError('User already exists');

      const register = await this.userService.register(name, email, password);
      return register instanceof Error ? new InternalServerError('An unexpected error occurred') : new Created(new RegisterResponse(register.token, register.user));

    } catch (error) {
      console.log(error);
      throw new InternalServerError('An unexpected error occurred');
    }
  }

  @Authorized()
  @Post('/status')
  @Parameter('email', 'body', 'email', true)
  @HttpCode(202)
  @Description('account status update')
  async status(@Body() body: { email: string; }): Promise<any> {
    try {
      if (!body.email) return new BadRequestError('email is required');
      const check = await this.userService.status(body.email);
      if (check) return new Ok({ message: 'User activated successfully' });
      else return new Ok({ message: 'User deactivated successfully' });
    } catch (error) {
      throw new InternalServerError('An unexpected error occurred');
    }
  }

  @Authorized()
  @Post('/admin')
  @Parameter('email', 'body', 'email', true)
  @HttpCode(202)
  @Description('admin status update')
  async admin(@Body() body: { email: string; }): Promise<any> {
    try {
      if (!body.email) return new BadRequestError('email is required');
      const check = await this.userService.admin(body.email);
      if (check) return new Ok({ message: 'User admin successfully' });
      else return new Ok({ message: 'User admin deactivated successfully' });
    } catch (error) {
      throw new InternalServerError('An unexpected error occurred while clearing tokens');
    }
  }

  @Authorized()
  @Post('/clear-tokens')
  @Parameter('email', 'body', 'Email of the user whose tokens should be cleared', true)
  @HttpCode(203)
  @Description("Clears all tokens associated with the specified email.")
  async clearTokens(@Body() body: { email: string; }): Promise<any> {
    try {
      if (!body.email) return new BadRequestError('email is required');
      await this.userService.clearToken(body.email);
      return new Ok({ message: 'Tokens cleared successfully' });
    } catch (error) {
      throw new InternalServerError('An unexpected error occurred while clearing tokens');
    }
  }
}