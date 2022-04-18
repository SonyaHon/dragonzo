import { Test } from '@nestjs/testing';
import { getConfigValueToken } from '@sonyahon/config';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import { SecurityConfig } from '../../config/security.config';
import { UserEntity } from '../../domain/user/entities';
import { GenerateJWTQuery } from '../../domain/user/queries/generate-jwt.query';
import { GenerateJWTService } from './generate-jwt.service';

describe('Generate JWT Service', () => {
  let service: GenerateJWTService;
  const jwtSecret = 'super-secret';
  const jwtLifetime = 1000 * 1;
  const jwtIssuer = 'service';

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        GenerateJWTService,
        {
          provide: getConfigValueToken(SecurityConfig, 'jwtSecret'),
          useValue: jwtSecret,
        },
        {
          provide: getConfigValueToken(SecurityConfig, 'jwtLifetime'),
          useValue: jwtLifetime,
        },
        {
          provide: getConfigValueToken(SecurityConfig, 'jwtIssuer'),
          useValue: jwtIssuer,
        },
      ],
    }).compile();
    service = testingModule.get(GenerateJWTService);
  });

  test('Generate jwt', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {},
    });
    const result = await service.execute(new GenerateJWTQuery(user, 'bob'));
    const validated = verify(result, jwtSecret);
    expect(validated).toMatchObject({
      sub: 'id',
      iss: jwtIssuer,
      aud: 'bob',
      data: {
        username: 'username',
        metadata: {},
      },
    });
  });

  test('Generate jwt with meta', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {
        bob: {
          friensWithAlice: true,
        },
      },
    });
    const result = await service.execute(new GenerateJWTQuery(user, 'bob'));
    const validated = verify(result, jwtSecret);
    expect(validated).toMatchObject({
      sub: 'id',
      iss: jwtIssuer,
      aud: 'bob',
      data: {
        username: 'username',
        metadata: {
          friensWithAlice: true,
        },
      },
    });
  });

  test('Generated jwt should have a lifetime', async () => {
    const user = new UserEntity({
      id: 'id',
      username: 'username',
      password: 'password',
      metadata: {
        bob: {
          friensWithAlice: true,
        },
      },
    });
    const result = await service.execute(new GenerateJWTQuery(user, 'bob'));
    // sleep for 1.5 secs to outdate JWT
    await new Promise((resolve) => setTimeout(resolve, 1000 * 1.5));
    await expect(async () => {
      verify(result, jwtSecret);
    }).rejects.toBeInstanceOf(TokenExpiredError);
  });
});
