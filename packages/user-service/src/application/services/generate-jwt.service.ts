import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectValue } from '@sonyahon/config';
import { sign } from 'jsonwebtoken';
import { SecurityConfig } from '../../config/security.config';
import { UserEntity } from '../../domain/user/entities';
import { UserMetaNotFoundException } from '../../domain/user/exceptions/user-meta-not-found.exception';
import { GenerateJWTQuery } from '../../domain/user/queries/generate-jwt.query';

@QueryHandler(GenerateJWTQuery)
export class GenerateJWTService implements IQueryHandler<GenerateJWTQuery> {
  constructor(
    @InjectValue(SecurityConfig, 'jwtSecret')
    private readonly jwtSecret: string,
    @InjectValue(SecurityConfig, 'jwtLifetime')
    private readonly jwtLifetime: number,
    @InjectValue(SecurityConfig, 'jwtIssuer')
    private readonly jwtIssuer: string,
  ) {}

  async execute(query: GenerateJWTQuery): Promise<string> {
    return await this.signJwt(query);
  }

  private signJwt({ user, audience }: GenerateJWTQuery) {
    return sign(
      {
        sub: user.getId(),
        iss: this.jwtIssuer,
        aud: audience,
        data: {
          username: user.getUsername(),
          metadata: this.getUserMetaForAudience(user, audience),
        },
      },
      this.jwtSecret,
      {
        expiresIn: this.getLifetimeInSeconds(),
      },
    );
  }

  private getUserMetaForAudience(user: UserEntity, audience: string) {
    try {
      return user.getMeta(audience);
    } catch (error) {
      if (error instanceof UserMetaNotFoundException) {
        return {};
      }
    }
  }

  private getLifetimeInSeconds() {
    return Math.floor(this.jwtLifetime / 1000);
  }
}
