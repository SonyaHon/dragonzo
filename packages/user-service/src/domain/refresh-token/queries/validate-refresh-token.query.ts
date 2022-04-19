import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export class ValidateRefreshTokenQuery {
  constructor(public readonly refreshToken: RefreshTokenEntity) {}
}
