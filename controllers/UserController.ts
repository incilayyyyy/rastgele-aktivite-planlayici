import { JsonController, Patch, Delete, Param, Body, Authorized, InternalServerError } from 'routing-controllers';
import { Service } from 'typedi';
import { UserService } from '../services/UserService';
import { Ok } from '../responses/Success';
import { NotFoundError } from '../responses/Errors';
import { User } from '../entities/User';

@Service()
@JsonController('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorized()
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() body: Partial<User>) {
    try {
      const updatedUser = await this.userService.updateUser(id, body.name, body.email, body.password, body.admin, body.status);
      return new Ok(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return new NotFoundError('User not found');
      }
      return new InternalServerError('An unexpected error occurred');
    }
  }

  @Authorized()
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      await this.userService.deleteUser(id);
      return new Ok({ message: 'User deleted successfully' });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return new NotFoundError('User not found');
      }
      return new InternalServerError('An unexpected error occurred');
    }
  }
}
