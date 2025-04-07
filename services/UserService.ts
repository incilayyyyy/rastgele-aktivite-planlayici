import { Repository } from 'typeorm';
import argon2 from 'argon2';
import { User } from '../entities/User';
import Database from '../config/Database';
import { Service } from 'typedi';
import { NotFoundError, UnauthorizedError } from 'routing-controllers';
import { AuthService } from './AuthService';
import { ObjectId } from 'mongodb';

@Service()
export class UserService {
  private userRepository: Repository<User>;
  private authService: AuthService;

  constructor() {
    this.userRepository = Database.dataSource.getRepository(User);
    this.authService = new AuthService();
  }

  async register(name: string, email: string, password: string, admin: boolean = false, status: boolean = false): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const hashedPassword = await argon2.hash(password);
    const user = new User(name, email, hashedPassword, admin, status);
    const newUser = await this.userRepository.save(user);
    const token = await this.authService.generateToken(newUser._id.toString());

    const { password: _, ...userWithoutPassword } = newUser;

    return { token, user: userWithoutPassword };
  }

  async login(email: string, password: string): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundError('User not found');

    const isPasswordValid = await this.verifyPassword(user, password);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid password');

    const token = await this.authService.generateToken(user._id.toString());
    const { password: _, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }

  async status(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundError('User not found');

    user.status = !user.status;
    await this.save(user);
    return user.status;
  }

  async admin(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundError('User not found');

    user.admin = !user.admin;
    await this.save(user);
    return user.admin;
  }

  async updateUser(id: string, name?: string, email?: string, password?: string, admin?: boolean, status?: boolean): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundError('User not found');

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await argon2.hash(password);
    if (admin !== undefined) user.admin = admin;
    if (status !== undefined) user.status = status;

    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundError('User not found');

    await this.userRepository.remove(user);
  }

  async listUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createOrUpdateUser(email: string, name: string, password: string, admin: boolean = false, status: boolean = false): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      user.name = name;
      user.password = await argon2.hash(password);
      user.admin = admin;
      user.status = status;
    } else {
      user = new User(name, email, await argon2.hash(password), admin, status);
    }
    return this.userRepository.save(user);
  }

  async clearToken(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundError('User not found');
    return this.authService.clearToken(user._id.toString());
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  private async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  private async verifyPassword(user: User, password: string): Promise<boolean> {
    return argon2.verify(user.password, password);
  }
}