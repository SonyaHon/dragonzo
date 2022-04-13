import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from 'src/services/user/user.service';
import { AuthenticateDTO } from './dtos/authenticate.dto';
import { RegisterDTO } from './dtos/register.dto';

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ command: 'register' })
  async register(@Payload() { username, password }: RegisterDTO) {
    const result = await this.userService.createUser(username, password);
    return result._id;
  }

  @MessagePattern({ command: 'authenticate' })
  async authenticate(@Payload() { username, password }: AuthenticateDTO) {
    const result = await this.userService.authenticateUser(username, password);
    return result;
  }
}
