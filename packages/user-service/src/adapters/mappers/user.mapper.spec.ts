import { User } from '@prisma/client';
import { UserEntity } from '../../domain/user/entities';
import { mapDbUserToDomain } from './user.mapper';

describe('User mappers', () => {
  test('Should map without loggedIn time', () => {
    const input: User = {
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
      lastTimeLoggedIn: null,
    };
    const user = mapDbUserToDomain(input);
    expect(user).toBeInstanceOf(UserEntity);
  });

  test('Should map with logged in time', async () => {
    const input: User = {
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
      lastTimeLoggedIn: new Date(),
    };
    const user = mapDbUserToDomain(input);
    expect(user).toBeInstanceOf(UserEntity);
  });
});
