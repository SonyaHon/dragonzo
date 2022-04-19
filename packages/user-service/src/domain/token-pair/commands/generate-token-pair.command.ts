import { UserEntity } from '../../user/entities';

export class GenerateTokenPairCommand {
  constructor(
    public readonly user: UserEntity,
    public readonly audience: string,
  ) {}
}
