import { UserEntity } from '../entities';

export class UpdateUserCommand {
  constructor(
    public readonly user: UserEntity,
    public readonly audience: string,
    public readonly newMeta: Record<string, unknown>,
  ) {}
}
