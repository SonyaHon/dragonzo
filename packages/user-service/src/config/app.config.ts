import { Config, EnvVar, Integer, String } from '@sonyahon/config';

@Config('USER_SERVICE')
export class AppConfig {
  @EnvVar('JWT_SIGN_SECRET')
  @String({ from: 8 })
  jwtSignSecret = 'super-secret';

  @EnvVar('JWT_EXPIRATION')
  @Integer()
  jwtExpiration: number = 1000 * 60 * 5; // 5 minutes

  @EnvVar('REFRESH_TOKEN_LIFETIME')
  @Integer()
  refreshTokenLifetime: number = 1000 * 60 * 60 * 24; // 24 hours

  @EnvVar('DEFAULT_ROOT_USERNAME')
  defaultRootUsername = 'root';

  @EnvVar('DEFAULT_ROOT_PASSWORD')
  @String({ from: 8 })
  defaultRootPassword = 'rootroot';
}
