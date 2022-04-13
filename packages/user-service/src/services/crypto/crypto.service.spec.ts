import { CryptoService } from './crypto.service';
import { PasswordsDoNotMatchException } from './crypto.service.exceptions';

describe('Crypto Service', () => {
  const service = new CryptoService();

  test('Should hash and validate password', async () => {
    const password = 'super-secret-123';
    const hash = await service.hash(password);
    expect(hash).not.toBe(password);
    expect(await service.validate(hash, password)).toBe(true);
  });

  test('Should throw if passwords do not match', async () => {
    await expect(async () => {
      const hash = await service.hash('some-password');
      await service.validate(hash, 'another-password');
    }).rejects.toBeInstanceOf(PasswordsDoNotMatchException);
  });
});
