import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { RefreshTokenEntity } from '../../domain/refresh-token/entities/refresh-token.entity';
import { UserEntity } from '../../domain/user/entities';
import { mapDbRefreshTokenToDomain } from '../mappers/refresh-token.mapper';
import { PrismaAdapter } from './prisma.adapter';

@Injectable()
export class RefreshTokenRepositoryAdapter {
  constructor(private readonly prisma: PrismaAdapter) {}

  private async generateRandomTokenString() {
    return nanoid();
  }

  async createToken(user: UserEntity): Promise<RefreshTokenEntity> {
    const token = await this.prisma.refreshToken.create({
      data: {
        token: await this.generateRandomTokenString(),
        createdAt: new Date(),
        userId: user.getId(),
      },
      include: {
        user: true,
      },
    });
    return mapDbRefreshTokenToDomain(token);
  }
}
