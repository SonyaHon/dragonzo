import { UserEntity } from '../entities';

export class UserDeletedEvent {
  constructor(public readonly deletedUser: UserEntity) {}
}
