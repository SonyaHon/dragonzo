import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export class DeleteRefreshTokenCommand {
  constructor(public readonly refreshToken: RefreshTokenEntity) {}
}
