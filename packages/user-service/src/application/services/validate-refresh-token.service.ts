import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateRefreshTokenQuery } from '../../domain/refresh-token/queries/validate-refresh-token.query';
import { InvalidRefreshTokenException } from '../../domain/refresh-token/exceptions/invalid-refresh-token.exception';
import { InjectValue } from '@sonyahon/config';
import { SecurityConfig } from '../../config/security.config';

@QueryHandler(ValidateRefreshTokenQuery)
export class ValidateRefreshTokenService
  implements IQueryHandler<ValidateRefreshTokenQuery>
{
  constructor(
    @InjectValue(SecurityConfig, 'refreshTokenLifetime')
    private readonly refreshTokenLifetime: number,
  ) {}

  async execute({
    refreshToken,
    audience,
  }: ValidateRefreshTokenQuery): Promise<void> {
    if (!refreshToken) {
      throw new InvalidRefreshTokenException();
    }
    const tokenOutdated =
      refreshToken.getCreatedAtAsTimestamp() + this.refreshTokenLifetime <=
      Date.now();

    if (tokenOutdated) {
      throw new InvalidRefreshTokenException();
    }

    if (refreshToken.getAudience() !== audience) {
      throw new InvalidRefreshTokenException();
    }
  }
}
