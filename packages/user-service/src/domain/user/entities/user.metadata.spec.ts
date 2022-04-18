import { UserMetaNotFoundException } from '../exceptions/user-meta-not-found.exception';
import { Metadata } from './user.metadata';
import { UserRole } from './user.role';

describe('User metadata', () => {
  test('Create w/ no params', () => {
    const meta = new Metadata();
    expect(meta).toBeInstanceOf(Metadata);
  });

  test('Create w/ default params', () => {
    const meta = new Metadata({
      'user-service': {
        role: UserRole.Root,
      },
    });
    expect(meta).toBeInstanceOf(Metadata);
  });

  test('Should return meta', () => {
    const meta = new Metadata({
      'user-service': {
        role: UserRole.Root,
      },
    });
    const resullt = meta.getFor('user-service');
    expect(resullt).toEqual({
      role: UserRole.Root,
    });
  });

  test('Should throw if meta not found', async () => {
    await expect(async () => {
      const meta = new Metadata();
      meta.getFor('user-service');
    }).rejects.toBeInstanceOf(UserMetaNotFoundException);
  });
});
