import { Test } from '@nestjs/testing';
import { UserEntity } from '../../domain/user/entities';
import { EncryptPasswordQuery } from '../../domain/user/queries/encrypt-password.query';
import { ValidateUserPasswordQuery } from '../../domain/user/queries/validate-user-password.query';
import { InvalidPasswordException } from '../exceptions/invalid-password.exception';
import { EncryptPasswordService } from './encrypt-password.service';
import { ValidateUserPasswordService } from './validate-user-password.query';

describe('Validate user password ', () => {
  let service: ValidateUserPasswordService;
  const passwordHasher = new EncryptPasswordService();

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [ValidateUserPasswordService],
    }).compile();
    service = testingModule.get(ValidateUserPasswordService);
  });

  test('Validate correct password', async () => {
    const rawPassword = 'password';
    const hashedPassword = await passwordHasher.execute(
      new EncryptPasswordQuery(rawPassword),
    );
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: hashedPassword,
      metadata: {},
    });

    await expect(async () => {
      await service.execute(new ValidateUserPasswordQuery(user, rawPassword));
    }).resolves;
  });

  test('Throws if password is incorrect', async () => {
    const rawPassword = 'password';
    const hashedPassword = await passwordHasher.execute(
      new EncryptPasswordQuery(rawPassword),
    );
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: hashedPassword,
      metadata: {},
    });

    await expect(async () => {
      await service.execute(
        new ValidateUserPasswordQuery(user, 'incorrect-password'),
      );
    }).rejects.toBeInstanceOf(InvalidPasswordException);
  });
});
