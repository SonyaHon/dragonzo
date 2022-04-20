import { UserEntity } from '../../user/entities';
import { RefreshTokenEntity } from './refresh-token.entity';

describe('Refresh token entity', () => {
  const now = Date.now();
  const user = new UserEntity({
    id: 'id',
    username: 'username',
    password: 'password',
    metadata: {},
  });
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
