import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { UserRepositoryAdapter } from '../../adapters/database/user-repository.adapter';
import { DatabaseConflictException } from '../../adapters/exceptions/database-conflict.execption';
import { CreateUserCommand } from '../../domain/user/commands/create-user.command';
import { UserEntity, UserRole } from '../../domain/user/entities';
import { UserCreatedEvent } from '../../domain/user/events/user-created.event';
import { DublicatedUserException } from '../exceptions/dublicated-user.exception';
import { CreateUserService } from './create-user.service';

describe('CreateUser Service', () => {
  let service: CreateUserService;
  const eventBus = {
    publish: jest.fn(),
  };
  const userRepo = {
    createUser: jest.fn(),
  };
  const queryBus = {
    execute: jest.fn(),
  };

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: EventBus,
          useValue: eventBus,
        },
        {
          provide: QueryBus,
          useValue: queryBus,
        },
        {
          provide: UserRepositoryAdapter,
          useValue: userRepo,
        },
      ],
    }).compile();
    service = testingModule.get(CreateUserService);
  });

  test('Should successfuly create "user" user', async () => {
    userRepo.createUser.mockReturnValueOnce(
      new UserEntity({
        id: 'id',
        username: 'username',
        password: 'password',
        metadata: {
          'user-service': {
            role: UserRole.User,
          },
        },
      }),
    );

    const result = await service.execute(
      new CreateUserCommand('username', 'password'),
    );
    expect(result).toBeInstanceOf(UserEntity);
    expect(result.getUsername()).toBe('username');
    expect(result.isUser()).toBe(true);
    expect(eventBus.publish).toBeCalledWith(expect.any(UserCreatedEvent));
  });

  test('Should throw DublicateUserException if username already taken', async () => {
    userRepo.createUser.mockRejectedValueOnce(new DatabaseConflictException());
    await expect(async () => {
      await service.execute(new CreateUserCommand('username', 'password'));
    }).rejects.toBeInstanceOf(DublicatedUserException);
  });

  test('Should upthrow unknown exceptions', async () => {
    userRepo.createUser.mockRejectedValueOnce(new Error('Unknown error'));
    await expect(async () => {
      await service.execute(new CreateUserCommand('username', 'password'));
    }).rejects.toHaveProperty('message', 'Unknown error');
  });
});
