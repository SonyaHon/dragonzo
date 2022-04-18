import { Test } from '@nestjs/testing';
import { UserRepositoryAdapter } from '../../adapters/database/user-repository.adapter';
import { DatabaseNotFoundException } from '../../adapters/exceptions/database-not-found.exception';
import { UserEntity } from '../../domain/user/entities';
import { FindUserQuery } from '../../domain/user/queries/find-user.query';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { FindUserService } from './find-user.service';

describe('Find user service', () => {
  const userRepositoryAdapter = {
    findUserById: jest.fn(),
    findUserByUsername: jest.fn(),
  };
  let service: FindUserService;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        FindUserService,
        { provide: UserRepositoryAdapter, useValue: userRepositoryAdapter },
      ],
    }).compile();

    service = testingModule.get(FindUserService);
  });

  test('Should return user if it is presented (id)', async () => {
    userRepositoryAdapter.findUserById.mockResolvedValueOnce(
      new UserEntity({
        id: 'some-id',
        username: 'some-username',
        password: 'some-password',
        metadata: {},
      }),
    );

    const result = await service.execute(
      new FindUserQuery({
        id: 'some-id',
      }),
    );
    expect(result).toBeInstanceOf(UserEntity);
    expect(result.getId()).toBe('some-id');
  });

  test('Should return user if it is presented (username)', async () => {
    userRepositoryAdapter.findUserByUsername.mockResolvedValueOnce(
      new UserEntity({
        id: 'some-id',
        username: 'some-username',
        password: 'some-password',
        metadata: {},
      }),
    );

    const result = await service.execute(
      new FindUserQuery({
        username: 'some-id',
      }),
    );
    expect(result).toBeInstanceOf(UserEntity);
    expect(result.getId()).toBe('some-id');
  });

  test('Should throw user not found exception if user is not presented (id)', async () => {
    userRepositoryAdapter.findUserById.mockRejectedValueOnce(
      new DatabaseNotFoundException(),
    );
    await expect(async () => {
      await service.execute(
        new FindUserQuery({
          id: 'some-id',
        }),
      );
    }).rejects.toBeInstanceOf(UserNotFoundException);
  });

  test('Should throw user not found exception if user is not presented (username)', async () => {
    userRepositoryAdapter.findUserByUsername.mockRejectedValueOnce(
      new DatabaseNotFoundException(),
    );
    await expect(async () => {
      await service.execute(
        new FindUserQuery({
          username: 'some-id',
        }),
      );
    }).rejects.toBeInstanceOf(UserNotFoundException);
  });

  test('Should upthrow unknwon exceptions (username)', async () => {
    userRepositoryAdapter.findUserByUsername.mockRejectedValueOnce(
      new Error('Unkown error'),
    );
    await expect(async () => {
      await service.execute(
        new FindUserQuery({
          username: 'some-id',
        }),
      );
    }).rejects.toHaveProperty('message', 'Unkown error');
  });
});
