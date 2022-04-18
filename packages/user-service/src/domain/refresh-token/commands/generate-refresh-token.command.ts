import { UserEntity } from '../../user/entities';

export class GenerateRefreshTokenCommand {
  constructor(public readonly user: UserEntity) {}
}
