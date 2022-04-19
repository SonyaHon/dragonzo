import { RefreshTokenPairService } from './refresh-token-pair.service';
import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

describe('RefreshTokenPair service', () => {
  let service: RefreshTokenPairService;
  const queryBus = {};
  const commandBus = {};

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

  // @TODO Add proper testing to this
  test('Dummy', () => {
    expect(service).toBeDefined();
  });
});
