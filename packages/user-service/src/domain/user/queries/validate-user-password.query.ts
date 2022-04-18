import { UserEntity } from '../entities';

export class ValidateUserPasswordQuery {
  constructor(
    public readonly user: UserEntity,
    public readonly possiblePassword: string,
  ) {}
}
