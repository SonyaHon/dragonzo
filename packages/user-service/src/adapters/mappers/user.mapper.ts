import { User } from '@prisma/client';
import { UserEntity } from '../../domain/user/entities';

export const mapDbUserToDomain = (dbUser: User): UserEntity => {
  return new UserEntity({
    id: dbUser.id,
    username: dbUser.username,
    password: dbUser.password,
    metadata: dbUser.metadata as Record<string, unknown>,
    lastTimeLoggedIn: dbUser.lastTimeLoggedIn
      ? dbUser.lastTimeLoggedIn.valueOf()
      : null,
  });
};
