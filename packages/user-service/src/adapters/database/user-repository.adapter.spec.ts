import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { UserEntity } from '../../domain/user/entities';
import { DatabaseConflictException } from '../exceptions/database-conflict.execption';
import { DatabaseNotFoundException } from '../exceptions/database-not-found.exception';
import { PrismaAdapter } from './prisma.adapter';
import { UserRepositoryAdapter } from './user-repository.adapter';

describe('User repo adapter', () => {
  let adapter: UserRepositoryAdapter;
  const prismaAdapter = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryAdapter,
        {
          provide: PrismaAdapter,
          useValue: prismaAdapter,
        },
      ],
    }).compile();

    adapter = testingModule.get(UserRepositoryAdapter);
  });

  test('Creating user', async () => {
    prismaAdapter.user.create.mockResolvedValueOnce({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    const user = await adapter.createUser({
      username: 'username',
      password: 'password',
    });
    expect(user).toBeInstanceOf(UserEntity);
  });

  test('Create user should throw if dublicate', async () => {
    prismaAdapter.user.create.mockRejectedValueOnce(
      new PrismaClientKnownRequestError('message', 'P2002', 'version'),
    );
    await expect(async () => {
      await adapter.createUser({
        username: 'username',
        password: 'password',
      });
    }).rejects.toBeInstanceOf(DatabaseConflictException);
  });

  test('Should upthrow while creating if error is unknown', async () => {
    prismaAdapter.user.create.mockRejectedValueOnce(new Error('Unknown error'));
    await expect(async () => {
      await adapter.createUser({
        username: 'username',
        password: 'password',
      });
    }).rejects.toHaveProperty('message', 'Unknown error');
  });

  test('Should find by username', async () => {
    prismaAdapter.user.findUnique.mockResolvedValueOnce({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    const result = await adapter.findUserByUsername('username');
    expect(result).toBeInstanceOf(UserEntity);
  });

  test('Should throw if user is not found by username', async () => {
    prismaAdapter.user.findUnique.mockRejectedValueOnce(
      new PrismaClientKnownRequestError('message', 'P2001', 'version'),
    );
    await expect(async () => {
      await adapter.findUserByUsername('username');
    }).rejects.toBeInstanceOf(DatabaseNotFoundException);
  });

  test('Should upthrow while finding by username if error is unknown', async () => {
    prismaAdapter.user.findUnique.mockRejectedValueOnce(
      new Error('Unknown error'),
    );
    await expect(async () => {
      await adapter.findUserByUsername('username');
    }).rejects.toHaveProperty('message', 'Unknown error');
  });

  test('Should find by id', async () => {
    prismaAdapter.user.findUnique.mockResolvedValueOnce({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    const result = await adapter.findUserById('id');
    expect(result).toBeInstanceOf(UserEntity);
  });

  test('Should throw if user is not found by id', async () => {
    prismaAdapter.user.findUnique.mockRejectedValueOnce(
      new PrismaClientKnownRequestError('message', 'P2001', 'version'),
    );
    await expect(async () => {
      await adapter.findUserById('id');
    }).rejects.toBeInstanceOf(DatabaseNotFoundException);
  });

  test('Should upthrow while finding by id if error is unknown', async () => {
    prismaAdapter.user.findUnique.mockRejectedValueOnce(
      new Error('Unknown error'),
    );
    await expect(async () => {
      await adapter.findUserById('username');
    }).rejects.toHaveProperty('message', 'Unknown error');
  });

  test('Should delete user', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    await expect(async () => {
      await adapter.deleteUser(user);
    }).resolves;
  });

  test('Should throw if user not found', async () => {
    prismaAdapter.user.delete.mockRejectedValueOnce(
      new PrismaClientKnownRequestError('message', 'P2001', 'version'),
    );
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    await expect(async () => {
      await adapter.deleteUser(user);
    }).rejects.toBeInstanceOf(DatabaseNotFoundException);
  });

  test('Should upthrow if unkown error', async () => {
    prismaAdapter.user.delete.mockRejectedValueOnce(new Error('Unknown error'));
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    await expect(async () => {
      await adapter.deleteUser(user);
    }).rejects.toHaveProperty('message', 'Unknown error');
  });

  test('Should update users meta', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });

    prismaAdapter.user.update.mockResolvedValueOnce({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {
        audience: {
          foo: 'bar',
        },
      },
      lastTimeLoggedIn: null,
    } as User);

    const updatedUser = await adapter.updateUserMeta(user, {
      audience: {
        foo: 'bar',
      },
    });

    expect(updatedUser).toBeInstanceOf(UserEntity);
  });

  test('Should throw if user not found', async () => {
    prismaAdapter.user.update.mockRejectedValueOnce(
      new PrismaClientKnownRequestError('message', 'P2001', 'version'),
    );
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    await expect(async () => {
      await adapter.updateUserMeta(user, {});
    }).rejects.toBeInstanceOf(DatabaseNotFoundException);
  });

  test('Should upthrow if unkown error', async () => {
    prismaAdapter.user.update.mockRejectedValueOnce(new Error('Unknown error'));
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    await expect(async () => {
      await adapter.updateUserMeta(user, {});
    }).rejects.toHaveProperty('message', 'Unknown error');
  });
});
