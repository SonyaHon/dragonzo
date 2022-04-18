import { UserMetaNotFoundException } from '../exceptions/user-meta-not-found.exception';
import { UserNevetLoggedInException } from '../exceptions/user-never-logged-in.exception';
import { UserEntity } from './user.enity';
import { UserRole } from './user.role';

describe('User entity', () => {
  const user = new UserEntity({
    id: 'id',
    username: 'username',
    password: 'password',
    metadata: {
      'user-service': {
        role: UserRole.User,
      },
    },
  });

  test('Should be defined', () => {
    expect(user).toBeInstanceOf(UserEntity);
  });

  test('Should have correct fields', async () => {
    expect(user.getId()).toBe('id');
    expect(user.getUsername()).toBe('username');
    expect(user.getPassword()).toBe('password');
    expect(user.getRole()).toBe(UserRole.User);
    expect(user.isRoot()).toBe(false);
    expect(user.isUser()).toBe(true);
    await expect(async () => {
      user.getLastTimeLoggedInAsTimestamp();
    }).rejects.toBeInstanceOf(UserNevetLoggedInException);
    await expect(async () => {
      user.getLastTimeLoggedInAsDate();
    }).rejects.toBeInstanceOf(UserNevetLoggedInException);
  });

  test('Should return lastTimeLoggedIn', () => {
    const now = Date.now();
    const loggedInUser = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {
        'user-service': {
          role: UserRole.User,
        },
      },
      lastTimeLoggedIn: now,
    });

    expect(loggedInUser.getLastTimeLoggedInAsTimestamp()).toBe(now);
    expect(loggedInUser.getLastTimeLoggedInAsDate().isValid).toBe(true);
  });

  test('Should return correct metadata if exist', () => {
    expect(user.getMeta('user-service')).toEqual({
      role: UserRole.User,
    });
  });

  test('Should throw if metadata do not exists', async () => {
    await expect(async () => {
      user.getMeta('some-unknown-service');
    }).rejects.toBeInstanceOf(UserMetaNotFoundException);
  });
});
