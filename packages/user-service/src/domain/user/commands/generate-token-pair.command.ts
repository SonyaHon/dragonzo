import { UserEntity } from '../entities';

export class GenerateTokenPairCommand {
  constructor(
    public readonly user: UserEntity,
    public readonly audience: string,
  ) {}
}
