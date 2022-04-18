import { UserEntity } from '../entities';

export class GenerateJWTQuery {
  constructor(
    public readonly user: UserEntity,
    public readonly audience: string,
  ) {}
}
