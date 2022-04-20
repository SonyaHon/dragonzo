import { Test } from '@nestjs/testing';
import { RefreshToken, User } from '@prisma/client';
import { RefreshTokenEntity } from '../../domain/refresh-token/entities/refresh-token.entity';
import { UserEntity } from '../../domain/user/entities';
import { PrismaAdapter } from './prisma.adapter';
import { RefreshTokenRepositoryAdapter } from './refresh-token-repository.adapter';
import { DatabaseNotFoundException } from '../exceptions/database-not-found.exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

describe('Refresh token repository adapter', () => {
  let adapter: RefreshTokenRepositoryAdapter;
  const prismaAdapter = {
    refreshToken: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenRepositoryAdapter,
        { provide: PrismaAdapter, useValue: prismaAdapter },
      ],
    }).compile();
    adapter = testingModule.get(RefreshTokenRepositoryAdapter);
  });

  test('Should create token', async () => {
    prismaAdapter.refreshToken.create.mockResolvedValueOnce({
      token: 'token',
      createdAt: new Date(),
      audience: 'audience',
      user: {
        id: 'id',
        username: 'username',
        password: 'password',
        metadata: {},
        lastTimeLoggedIn: null,
      },
    } as RefreshToken & { user: User });
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    const token = await adapter.createToken(user, 'audience');
    expect(token).toBeInstanceOf(RefreshTokenEntity);
  });

  test('Should delete token', async () => {
    const refreshToken = new RefreshTokenEntity({
      token: 'token',
      createdAt: Date.now(),
      audience: 'audience',
      user: new UserEntity({
        id: 'id',
        username: 'username',
        password: 'password',
        metadata: {},
      }),
    });

    await expect(adapter.deleteToken(refreshToken)).resolves;
  });

  test('Should throw if token not found', async () => {
    const refreshToken = new RefreshTokenEntity({
      token: 'token',
      createdAt: Date.now(),
      audience: 'audience',
      user: new UserEntity({
        id: 'id',
        username: 'username',
        password: 'password',
        metadata: {},
      }),
    });

    prismaAdapter.refreshToken.delete.mockRejectedValueOnce(
      new PrismaClientKnownRequestError('message', 'P2001', 'version'),
    );

    await expect(async () =>
      adapter.deleteToken(refreshToken),
    ).rejects.toBeInstanceOf(DatabaseNotFoundException);
  });

  test('Should upthrow if unknown error', async () => {
    const refreshToken = new RefreshTokenEntity({
      token: 'token',
      createdAt: Date.now(),
      audience: 'audience',
      user: new UserEntity({
        id: 'id',
        username: 'username',
        password: 'password',
        metadata: {},
      }),
    });

    prismaAdapter.refreshToken.delete.mockRejectedValueOnce(
      new Error('Unknown error'),
    );

    await expect(async () =>
      adapter.deleteToken(refreshToken),
    ).rejects.toHaveProperty('message', 'Unknown error');
  });
});
