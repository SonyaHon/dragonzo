import { Test } from '@nestjs/testing';
import { RefreshToken, User } from '@prisma/client';
import { RefreshTokenEntity } from '../../domain/refresh-token/entities/refresh-token.entity';
import { UserEntity } from '../../domain/user/entities';
import { PrismaAdapter } from './prisma.adapter';
import { RefreshTokenRepositoryAdapter } from './refresh-token-repository.adapter';

describe('Refresh tokne repository adapter', () => {
  let adapter: RefreshTokenRepositoryAdapter;
  const prismaAdapter = {
    refreshToken: {
      create: jest.fn(),
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
    const token = await adapter.createToken(user);
    expect(token).toBeInstanceOf(RefreshTokenEntity);
  });
});
