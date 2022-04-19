import { RefreshTokenEntity } from '../../refresh-token/entities/refresh-token.entity';

export class RefreshTokenPairCommand {
  constructor(
    public readonly refreshToken: RefreshTokenEntity,
    public readonly audience: string,
  ) {}
}
