import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserRepositoryAdapter } from '../../adapters/database/user-repository.adapter';
import { DatabaseNotFoundException } from '../../adapters/exceptions/database-not-found.exception';
import { UserEntity } from '../../domain/user/entities';
import { FindUserQuery } from '../../domain/user/queries/find-user.query';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

@QueryHandler(FindUserQuery)
export class FindUserService implements IQueryHandler<FindUserQuery> {
  constructor(private readonly userRepository: UserRepositoryAdapter) {}
  async execute(query: FindUserQuery): Promise<UserEntity> {
    try {
      return await this.findUser(query);
    } catch (error) {
      throw this.throwNotFound(error);
    }
  }

  private throwNotFound(error: unknown) {
    if (error instanceof DatabaseNotFoundException) {
      return new UserNotFoundException();
    }
    return error;
  }

  async findUser(query: FindUserQuery) {
    if (query.isById()) {
      return await this.userRepository.findUserById(query.getValue());
    }
    return await this.userRepository.findUserByUsername(query.getValue());
  }
}
