import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { RefreshTokenEntity } from '../../domain/refresh-token/entities/refresh-token.entity';
import { UserEntity } from '../../domain/user/entities';
import { mapDbRefreshTokenToDomain } from '../mappers/refresh-token.mapper';
import { PrismaAdapter } from './prisma.adapter';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { DatabaseNotFoundException } from '../exceptions/database-not-found.exception';

@Injectable()
export class RefreshTokenRepositoryAdapter {
  constructor(private readonly prisma: PrismaAdapter) {}

  private static async generateRandomTokenString() {
    return nanoid();
  }

  async createToken(
    user: UserEntity,
    audience: string,
  ): Promise<RefreshTokenEntity> {
    const token = await this.prisma.refreshToken.create({
      data: {
        token: await RefreshTokenRepositoryAdapter.generateRandomTokenString(),
        createdAt: new Date(),
        audience: audience,
        userId: user.getId(),
      },
      include: {
        user: true,
      },
    });
    return mapDbRefreshTokenToDomain(token);
  }

  async deleteToken(refreshToken: RefreshTokenEntity) {
    try {
      await this.prisma.refreshToken.delete({
        where: {
          token: refreshToken.getToken(),
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2001'
      ) {
        throw new DatabaseNotFoundException();
      }
      throw error;
    }
  }
}
