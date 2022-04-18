import { Test } from '@nestjs/testing';
import { EncryptPasswordQuery } from '../../domain/user/queries/encrypt-password.query';
import { EncryptPasswordService } from './encrypt-password.service';

describe('Encrypt user password', () => {
  let service: EncryptPasswordService;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [EncryptPasswordService],
    }).compile();
    service = testingModule.get(EncryptPasswordService);
  });

  test('Should succefully encrypt passwords', async () => {
    const hashed = await service.execute(
      new EncryptPasswordQuery('some-password'),
    );
    expect(hashed).not.toBe('some-password');
  });
});
