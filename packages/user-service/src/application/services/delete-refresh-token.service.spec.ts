import { DeleteRefreshTokenService } from './delete-refresh-token.service';
import { Test } from '@nestjs/testing';
import { RefreshTokenRepositoryAdapter } from '../../adapters/database/refresh-token-repository.adapter';
import { UserEntity } from '../../domain/user/entities';
import { RefreshTokenEntity } from '../../domain/refresh-token/entities/refresh-token.entity';
import { DeleteRefreshTokenCommand } from '../../domain/refresh-token/commands/delete-refresh-token.command';
import { DatabaseNotFoundException } from '../../adapters/exceptions/database-not-found.exception';
import { RefreshTokenNotFoundException } from '../../domain/refresh-token/exceptions/refresh-token-not-found.exception';

describe('Delete refresh token service', () => {
  let service: DeleteRefreshTokenService;
  const refreshTokenRepository = {
    deleteToken: jest.fn(),
  };

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        DeleteRefreshTokenService,
        {
          provide: RefreshTokenRepositoryAdapter,
          useValue: refreshTokenRepository,
        },
      ],
    }).compile();

    service = testingModule.get(DeleteRefreshTokenService);
  });

  test('Should delete token', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    const refreshToken = new RefreshTokenEntity({
      token: 'token',
      user,
      createdAt: Date.now(),
    });

    await expect(async () => {
      await service.execute(new DeleteRefreshTokenCommand(refreshToken));
    }).resolves;
  });

  test('Should throw if token not found', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    const refreshToken = new RefreshTokenEntity({
      token: 'token',
      user,
      createdAt: Date.now(),
    });

    refreshTokenRepository.deleteToken.mockRejectedValueOnce(
      new DatabaseNotFoundException(),
    );

    await expect(async () => {
      await service.execute(new DeleteRefreshTokenCommand(refreshToken));
    }).rejects.toBeInstanceOf(RefreshTokenNotFoundException);
  });
});
