import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { UserRepositoryAdapter } from '../../adapters/database/user-repository.adapter';
import { DatabaseNotFoundException } from '../../adapters/exceptions/database-not-found.exception';
import { UpdateUserCommand } from '../../domain/user/commands/update-user.command';
import { UserEntity } from '../../domain/user/entities';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { UpdateUserService } from './update-user.serivce';

describe('Update user service', () => {
  let service: UpdateUserService;
  const userRepository = {
    updateUserMeta: jest.fn(),
  };
  const eventBus = {
    publish: jest.fn(),
  };

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        { provide: UserRepositoryAdapter, useValue: userRepository },
        { provide: EventBus, useValue: eventBus },
      ],
    }).compile();
    service = testingModule.get(UpdateUserService);
  });

  test('Should update user service', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {
        'user-service': {
          foo: 'bar',
        },
      },
    });
    const audience = 'some-service';
    const meta = { updated: true };
    userRepository.updateUserMeta.mockImplementationOnce((user, meta) => {
      return new UserEntity({
        id: user.getId(),
        username: user.getUsername(),
        password: user.getPassword(),
        metadata: meta,
      });
    });

    const updatedUser = await service.execute(
      new UpdateUserCommand(user, audience, meta),
    );

    expect(updatedUser).toBeInstanceOf(UserEntity);
    expect(updatedUser.equals(user)).toBe(true);
    expect(updatedUser.getMetaForEveryAudience()).toEqual({
      'user-service': {
        foo: 'bar',
      },
      [audience]: meta,
    });
    expect(updatedUser.getMeta(audience)).toEqual(meta);
  });

  test('Should throw if user is not found', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    const audience = 'some-service';
    const meta = { updated: true };
    userRepository.updateUserMeta.mockRejectedValueOnce(
      new DatabaseNotFoundException(),
    );

    await expect(async () => {
      await service.execute(new UpdateUserCommand(user, audience, meta));
    }).rejects.toBeInstanceOf(UserNotFoundException);
  });

  test('Should upthrow if error is unknown', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    const audience = 'some-service';
    const meta = { updated: true };
    userRepository.updateUserMeta.mockRejectedValueOnce(
      new Error('Unknown error'),
    );

    await expect(async () => {
      await service.execute(new UpdateUserCommand(user, audience, meta));
    }).rejects.toHaveProperty('message', 'Unknown error');
  });
});
