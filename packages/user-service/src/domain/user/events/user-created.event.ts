import { UserEntity } from '../entities';

export class UserCreatedEvent {
  constructor(public readonly createdUser: UserEntity) {}
}
