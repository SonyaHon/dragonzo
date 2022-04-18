import { UserRole } from '../entities';

export class CreateUserCommand {
  constructor(
    public readonly username: string,
    public readonly rawPassword: string,
    public readonly role: UserRole = UserRole.User,
  ) {}
}
