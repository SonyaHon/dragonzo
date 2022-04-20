import { RefreshTokenPairService } from './refresh-token-pair.service';
import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserEntity } from '../../domain/user/entities';
import { RefreshTokenEntity } from '../../domain/refresh-token/entities/refresh-token.entity';
import { RefreshTokenPairCommand } from '../../domain/token-pair/commands/refresh-token-pair.command';
import { TokenPair } from '../../domain/token-pair/entities/token-pair.entity';
import { GenerateTokenPairCommand } from '../../domain/token-pair/commands/generate-token-pair.command';

describe('RefreshTokenPair service', () => {
  let service: RefreshTokenPairService;
  const queryBus = {
    execute: jest.fn(),
  };
  const commandBus = {
    execute: jest.fn(),
  };

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenPairService,
        { provide: QueryBus, useValue: queryBus },
        { provide: CommandBus, useValue: commandBus },
      ],
    }).compile();
    service = testingModule.get(RefreshTokenPairService);
  });

  test('Should refresh token pairs', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    const refreshToken = new RefreshTokenEntity({
      token: 'token',
      user: user,
      audience: 'audience',
      createdAt: Date.now(),
    });

    commandBus.execute.mockImplementation((command) => {
      if (command instanceof GenerateTokenPairCommand) {
        return new TokenPair('accessToken', 'refreshToken');
      }
    });

    const result = await service.execute(
      new RefreshTokenPairCommand(refreshToken, 'bob-service'),
    );
    expect(result).toBeInstanceOf(TokenPair);
    commandBus.execute.mockRestore();
  });
});
