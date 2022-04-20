import { RefreshToken, User } from '@prisma/client';
import { RefreshTokenEntity } from '../../domain/refresh-token/entities/refresh-token.entity';
import { mapDbUserToDomain } from './user.mapper';

export const mapDbRefreshTokenToDomain = (
  dbRefreshToken: RefreshToken & { user: User },
): RefreshTokenEntity => {
  return new RefreshTokenEntity({
    token: dbRefreshToken.token,
    createdAt: dbRefreshToken.createdAt.valueOf(),
    user: mapDbUserToDomain(dbRefreshToken.user),
    audience: dbRefreshToken.audience,
  });
};
