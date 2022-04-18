import { Config, EnvVar, Integer } from '@sonyahon/config';

@Config('SECURITY')
export class SecurityConfig {
  // Signage key
  @EnvVar('JWT_SECRET')
  jwtSecret = 'super-secret';

  // Lifetime of JWT in ms
  @EnvVar('JWT_LIFETIME')
  @Integer()
  jwtLifetime: number = 1000 * 60 * 5;

  @EnvVar('JWT_ISSUER')
  jwtIssuer = 'dragonzo-user-service';
}
