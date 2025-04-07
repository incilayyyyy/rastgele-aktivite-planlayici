import { Action, UnauthorizedError } from 'routing-controllers';
import { Container } from 'typedi';
import { AuthService } from '../services/AuthService';

export const AuthMiddleware = async (action: Action, roles: string[]): Promise<boolean> => {
  try {
    const token = action.request.headers.authorization?.split(" ")[1];
    if (!token) throw new UnauthorizedError('No token provided');

    const authService = Container.get(AuthService);

    const user = await authService.authenticate(token);
    if (!user) throw new UnauthorizedError('Invalid token');

    action.request.user = user;
    return true;
  } catch (error: any) {  
    action.response.status(401).json({
      status: 401,
      message: error.message || 'Authorization error. Please check your request and try again.'
    }); return false;
  }
};
