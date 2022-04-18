import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { UserEntity } from '../../domain/user/entities';
import { DatabaseConflictException } from '../exceptions/database-conflict.execption';
import { DatabaseNotFoundException } from '../exceptions/database-not-found.exception';
import { mapDbUserToDomain } from '../mappers/user.mapper';
import { PrismaAdapter } from './prisma.adapter';

@Injectable()
export class UserRepositoryAdapter {
  constructor(private readonly prisma: PrismaAdapter) {}

  async createUser(data: Prisma.UserCreateInput): Promise<UserEntity> {
    try {
      return await this.createUserUnsafe(data);
    } catch (error) {
      throw this.createUserCatchError(error);
    }
  }

  private createUserCatchError(error: unknown) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return new DatabaseConflictException();
    }
    return error;
  }

  private async createUserUnsafe({
    username,
    password,
    metadata,
  }: Prisma.UserCreateInput) {
    const data = await this.prisma.user.create({
      data: {
        username,
        password,
        metadata,
      },
    });

    return mapDbUserToDomain(data);
  }

  async findUserByUsername(username: string): Promise<UserEntity> {
    try {
      return await this.findUserByUsernameUnsafe(username);
    } catch (error) {
      throw this.findUserByUsernameCatchError(error);
    }
  }

  private async findUserByUsernameUnsafe(username: string) {
    const data = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    return mapDbUserToDomain(data);
  }

  private findUserByUsernameCatchError(error: unknown) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2001'
    ) {
      return new DatabaseNotFoundException();
    }
    return error;
  }

  async findUserById(id: string): Promise<UserEntity> {
    try {
      return await this.findUserByIdUnsafe(id);
    } catch (error) {
      throw this.findByIdCatchError(error);
    }
  }

  private async findUserByIdUnsafe(id: string) {
    const data = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return mapDbUserToDomain(data);
  }

  private findByIdCatchError(error: unknown) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2001'
    ) {
      return new DatabaseNotFoundException();
    }
    return error;
  }

  async deleteUser(user: UserEntity) {
    try {
      await this.deleteUserUnsafe(user);
    } catch (error) {
      throw this.deleteUserCatchError(error);
    }
  }

  private async deleteUserUnsafe(user: UserEntity) {
    await this.prisma.user.delete({
      where: {
        id: user.getId(),
      },
    });
  }

  private deleteUserCatchError(error: unknown) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2001'
    ) {
      return new DatabaseNotFoundException();
    }
    return error;
  }

  async updateUserMeta(
    user: UserEntity,
    meta: Prisma.InputJsonObject,
  ): Promise<UserEntity> {
    try {
      return await this.updateUserMetaUnsafe(user, meta);
    } catch (error) {
      throw this.updateUserMetaCatchError(error);
    }
  }

  private async updateUserMetaUnsafe(
    user: UserEntity,
    meta: Prisma.InputJsonObject,
  ): Promise<UserEntity> {
    const data = await this.prisma.user.update({
      where: {
        id: user.getId(),
      },
      data: {
        metadata: meta,
      },
    });

    return mapDbUserToDomain(data);
  }

  private updateUserMetaCatchError(error: unknown) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2001'
    ) {
      return new DatabaseNotFoundException();
    }
    return error;
  }
}
