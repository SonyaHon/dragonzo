import { ValidateRefreshTokenService } from './validate-refresh-token.service';
import { Test } from '@nestjs/testing';
import { RefreshTokenEntity } from '../../domain/refresh-token/entities/refresh-token.entity';
import { UserEntity } from '../../domain/user/entities';
import { ValidateRefreshTokenQuery } from '../../domain/refresh-token/queries/validate-refresh-token.query';
import { InvalidRefreshTokenException } from '../../domain/refresh-token/exceptions/invalid-refresh-token.exception';
import { getConfigValueToken } from '@sonyahon/config';
import { SecurityConfig } from '../../config/security.config';

describe('Validate refresh token', () => {
  let service: ValidateRefreshTokenService;
  const refreshTokenLifetime = 1000 * 60 * 60 * 8;
  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        ValidateRefreshTokenService,
        {
          provide: getConfigValueToken(SecurityConfig, 'refreshTokenLifetime'),
          useValue: refreshTokenLifetime,
        },
      ],
    }).compile();
    service = testingModule.get(ValidateRefreshTokenService);
  });

  test('Should validate token correctly', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });

    const refreshToken = new RefreshTokenEntity({
      token: 'token',
      user,
      audience: 'audience',
      createdAt: Date.now(),
    });

    await expect(async () => {
      await service.execute(
        new ValidateRefreshTokenQuery(refreshToken, 'audience'),
      );
    }).resolves;
  });

  test('Should throw if token is undefined', async () => {
    await expect(async () => {
      await service.execute(
        new ValidateRefreshTokenQuery(null as RefreshTokenEntity, ''),
      );
    }).rejects.toBeInstanceOf(InvalidRefreshTokenException);
  });

  test('Should throw if token is outdated', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });

    const refreshToken = new RefreshTokenEntity({
      token: 'token',
      user,
      audience: 'audience',
      createdAt: Date.now() - 1000 * 60 * 60 * 24, // 25h long token
    });
    await expect(async () => {
      await service.execute(
        new ValidateRefreshTokenQuery(refreshToken, 'audience'),
      );
    }).rejects.toBeInstanceOf(InvalidRefreshTokenException);
  });

  test('Should throw if token audience is not the same', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });

    const refreshToken = new RefreshTokenEntity({
      token: 'token',
      user,
      audience: 'audience',
      createdAt: Date.now(),
    });
    await expect(async () => {
      await service.execute(
        new ValidateRefreshTokenQuery(refreshToken, 'not-audience'),
      );
    }).rejects.toBeInstanceOf(InvalidRefreshTokenException);
  });
});
