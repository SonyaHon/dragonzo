import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../../services/user/user.service';
import { AuthenticateDTO } from './dtos/authenticate.dto';
import { RegisterDTO } from './dtos/register.dto';
import { AuthenticateReturnType } from './return-types/authenticate.rt';
import { RegisterReturnType } from './return-types/register.rt';

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ command: 'register', option: { type: 'credentials' } })
  async registerViaCredentials(
    @Payload() { username, password }: RegisterDTO,
  ): Promise<RegisterReturnType> {
    const result = await this.userService.createUser(username, password);
    return {
      id: result._id,
      username: result.username,
    };
  }

  @MessagePattern({ command: 'authenticate', option: { type: 'credentials' } })
  async authenticateViaCredentials(
    @Payload() { username, password }: AuthenticateDTO,
  ): Promise<AuthenticateReturnType> {
    const result = await this.userService.authenticate(username, password);
    return result;
  }
}
