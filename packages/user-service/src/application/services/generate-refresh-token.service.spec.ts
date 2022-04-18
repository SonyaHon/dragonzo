import { Test } from '@nestjs/testing';
import { RefreshTokenRepositoryAdapter } from '../../adapters/database/refresh-token-repository.adapter';
import { GenerateRefreshTokenCommand } from '../../domain/refresh-token/commands/generate-refresh-token.command';
import { RefreshTokenEntity } from '../../domain/refresh-token/entities/refresh-token.entity';
import { UserEntity } from '../../domain/user/entities';
import { GenerateRefreshTokenService } from './generate-refresh-token.service';

describe('Generate refresh token serivce', () => {
  let service: GenerateRefreshTokenService;
  const refreshTokenRepo = {
    createToken: jest.fn(),
  };

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        GenerateRefreshTokenService,
        { provide: RefreshTokenRepositoryAdapter, useValue: refreshTokenRepo },
      ],
    }).compile();
    service = testingModule.get(GenerateRefreshTokenService);
  });

  test('Should generate', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    refreshTokenRepo.createToken.mockResolvedValueOnce(
      new RefreshTokenEntity({
        token: 'token',
        createdAt: Date.now(),
        user,
      }),
    );
    const result = await service.execute(new GenerateRefreshTokenCommand(user));
    expect(result).toBeInstanceOf(RefreshTokenEntity);
  });
});
