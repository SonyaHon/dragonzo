import { RefreshTokenEntity } from './refresh-token.entity';
import { createUserEntity } from '../../user/__test__/user-fixture';

describe('Refresh token entity', () => {
  const now = Date.now();
  const user = createUserEntity();
  const token = new RefreshTokenEntity({
    token: 'token',
    createdAt: now,
    audience: 'audience',
    user,
  });

  test('Check values', () => {
    expect(token.getToken()).toBe('token');
    expect(token.getUser()).toBe(user);
    expect(token.getCreatedAtAsTimestamp()).toBe(now);
    expect(token.getAudience()).toBe('audience');
    expect(token.getCreatedAtAsDate().isValid).toBe(true);
  });
});
