import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { UserRepositoryAdapter } from '../../adapters/database/user-repository.adapter';
import { DatabaseNotFoundException } from '../../adapters/exceptions/database-not-found.exception';
import { DeleteUserCommand } from '../../domain/user/commands/delete-user.command';
import { UserEntity } from '../../domain/user/entities';
import { UserDeletedEvent } from '../../domain/user/events/user-deleted.event';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { DeleteUserService } from './delete-user.service';

describe('Delete user service', () => {
  let service: DeleteUserService;
  const userRepository = {
    deleteUser: jest.fn(),
  };
  const eventBus = {
    publish: jest.fn(),
  };

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        { provide: UserRepositoryAdapter, useValue: userRepository },
        { provide: EventBus, useValue: eventBus },
      ],
    }).compile();

    service = testingModule.get(DeleteUserService);
  });

  test('Should delete users', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    await service.execute(new DeleteUserCommand(user));
    expect(eventBus.publish).toBeCalledWith(expect.any(UserDeletedEvent));
  });

  test('Should throw if user not found', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    userRepository.deleteUser.mockRejectedValueOnce(
      new DatabaseNotFoundException(),
    );

    await expect(async () => {
      await service.execute(new DeleteUserCommand(user));
    }).rejects.toBeInstanceOf(UserNotFoundException);
  });

  test('Should upthrow exception if unknown', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    userRepository.deleteUser.mockRejectedValueOnce(new Error('Unkown error'));

    await expect(async () => {
      await service.execute(new DeleteUserCommand(user));
    }).rejects.toHaveProperty('message', 'Unkown error');
  });
});
