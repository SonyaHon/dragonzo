import { UserEntity } from '../entities';

export class DeleteUserCommand {
  constructor(public readonly user: UserEntity) {}
}
