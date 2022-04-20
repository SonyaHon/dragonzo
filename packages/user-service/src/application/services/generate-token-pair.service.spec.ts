import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { RefreshTokenEntity } from '../../domain/refresh-token/entities/refresh-token.entity';
import { TokenPair } from '../../domain/token-pair/entities/token-pair.entity';
import { GenerateTokenPairCommand } from '../../domain/token-pair/commands/generate-token-pair.command';
import { UserEntity } from '../../domain/user/entities';
import { GenerateTokenPairService } from './generate-token-pair.service';

describe('GenerateTokenPair service', () => {
  let service: GenerateTokenPairService;
  const queryBus = {
    execute: jest.fn(),
  };
  const commandBus = {
    execute: jest.fn(),
  };

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        GenerateTokenPairService,
        { provide: QueryBus, useValue: queryBus },
        { provide: CommandBus, useValue: commandBus },
      ],
    }).compile();
    service = testingModule.get(GenerateTokenPairService);
  });

  test('Should generate token pair', async () => {
    commandBus.execute.mockReturnValueOnce(
      new RefreshTokenEntity({
        token: 'token',
        createdAt: Date.now(),
        audience: 'audience',
        user: new UserEntity({
          id: 'id',
          username: 'username',
          password: 'password',
          metadata: {},
        }),
      }),
    );
    const result = await service.execute(
      new GenerateTokenPairCommand(
        new UserEntity({
          id: 'id',
          username: 'username',
          password: 'password',
          metadata: {},
        }),
        'audience',
      ),
    );
    expect(result).toBeInstanceOf(TokenPair);
  });
});
