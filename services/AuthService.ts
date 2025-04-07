import jwt from 'jsonwebtoken';
import { ObjectId, Repository } from 'typeorm';
import Database from '../config/Database';
import { User } from '../entities/User';
import config from 'config';
import { Service } from 'typedi';
import { Redis } from '../config/Redis';

@Service()
export class AuthService {
  private userRepository: Repository<User>;
  private config: { key: string; expires_in: string | number };
  private redis: Redis;

  constructor() {
    this.userRepository = Database.dataSource.getRepository(User);
    this.config = config.get('app') as { key: string; expires_in: string | number };
    this.redis = new Redis();
  }

  public async generateToken(userId: string): Promise<string> {
    try {
      const token = jwt.sign({ id: userId }, "this.config.key", { expiresIn: "365d" });
      await this.redis.lpush(userId, token);

      return token;
    } catch (error: any) {
      throw new Error(`Failed to generate token: ${error.message}`);
    }
  }

  public async verifyToken(token: string): Promise<jwt.JwtPayload> {
    try {
      const payload = jwt.verify(token, this.config.key) as jwt.JwtPayload;
      const storedTokens = await this.redis.lrange(payload.id, 0, -1);

      if (!storedTokens.includes(token)) throw new Error('Token does not match');

      return payload;
    } catch (error: any) {
      throw new Error(`Failed to verify token: ${error.message}`);
    }
  }

  public async clearToken(id: string): Promise<boolean> {
    try {
      const tokens = await this.redis.lrange(id, 0, -1);
      for (const token of tokens) {
        const payload = jwt.verify(token, this.config.key) as jwt.JwtPayload;
        if (payload.id !== id) throw new Error('Invalid token payload');
        await this.redis.lrem(id, 0, token);
      } return true;
    } catch (error: any) {
      throw new Error(`Failed to clear tokens for user ${id}: ${error.message}`);
    }
  }

  public async authenticate(token: string): Promise<User | null> {
    try {
      const data = await this.verifyToken(token);
  
      const user = await this.userRepository.findOne({
        where: { _id: new ObjectId(data.id) }
      });
  
      if (user && user.status) return user;
  
      return null;
    } catch (error: any) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }
}