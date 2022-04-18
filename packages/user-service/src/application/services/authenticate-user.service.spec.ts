import { QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { UserEntity } from '../../domain/user/entities';
import { AuthenticateUserQuery } from '../../domain/user/queries/authenticate-user.query';
import { EncryptPasswordQuery } from '../../domain/user/queries/encrypt-password.query';
import { FindUserQuery } from '../../domain/user/queries/find-user.query';
import { ValidateUserPasswordQuery } from '../../domain/user/queries/validate-user-password.query';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { InvalidPasswordException } from '../exceptions/invalid-password.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { AuthenticateUserService } from './authenticate-user.service';
import { EncryptPasswordService } from './encrypt-password.service';

describe('Authenticate user', () => {
  let service: AuthenticateUserService;
  const queryBus = {
    execute: jest.fn(),
  };
  const passwordHasher = new EncryptPasswordService();

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        AuthenticateUserService,
        {
          provide: QueryBus,
          useValue: queryBus,
        },
      ],
    }).compile();
    service = testingModule.get(AuthenticateUserService);
  });

  test('Authenticate user w/ correct credentials', async () => {
    queryBus.execute.mockImplementationOnce(async (query) => {
      if (query instanceof FindUserQuery && query.isById() === false) {
        return new UserEntity({
          id: 'id',
          username: 'username',
          password: await passwordHasher.execute(
            new EncryptPasswordQuery('password'),
          ),
          metadata: {},
        });
      }
    });

    const result = await service.execute(
      new AuthenticateUserQuery('username', 'password'),
    );
    expect(result).toBeInstanceOf(UserEntity);
  });

  test('Throws if user is not found', async () => {
    queryBus.execute.mockImplementationOnce(async (query) => {
      if (query instanceof FindUserQuery && query.isById() === false) {
        throw new UserNotFoundException();
      }
    });
    await expect(async () => {
      await service.execute(new AuthenticateUserQuery('username', 'password'));
    }).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  test('Throws if users password is incorrect', async () => {
    queryBus.execute.mockImplementation(async (query) => {
      if (query instanceof FindUserQuery && query.isById() === false) {
        return new UserEntity({
          id: 'id',
          username: 'username',
          password: await passwordHasher.execute(
            new EncryptPasswordQuery('password'),
          ),
          metadata: {},
        });
      } else if (query instanceof ValidateUserPasswordQuery) {
        throw new InvalidPasswordException();
      }
      throw new Error('Wrong flow');
    });

    await expect(async () => {
      await service.execute(
        new AuthenticateUserQuery('username', 'incorrect-password'),
      );
    }).rejects.toBeInstanceOf(InvalidCredentialsException);
    queryBus.execute.mockRestore();
  });

  test('Should upthrow if unknown error occured', async () => {
    queryBus.execute.mockRejectedValueOnce(new Error('Unknown error'));
    await expect(async () => {
      await service.execute(new AuthenticateUserQuery('username', 'password'));
    }).rejects.toHaveProperty('message', 'Unknown error');
  });
});
