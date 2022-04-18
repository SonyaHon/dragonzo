import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';

import { UserRepositoryAdapter } from '../../adapters/database/user-repository.adapter';
import { DatabaseConflictException } from '../../adapters/exceptions/database-conflict.execption';
import { CreateUserCommand } from '../../domain/user/commands/create-user.command';
import { UserEntity, USER_SERVICE_META } from '../../domain/user/entities';
import { UserCreatedEvent } from '../../domain/user/events/user-created.event';
import { EncryptPasswordQuery } from '../../domain/user/queries/encrypt-password.query';
import { DublicatedUserException } from '../exceptions/dublicated-user.exception';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
    private readonly userRepository: UserRepositoryAdapter,
  ) {}

  private async createUser({ username, rawPassword, role }: CreateUserCommand) {
    const password = await this.queryBus.execute(
      new EncryptPasswordQuery(rawPassword),
    );

    const user = await this.userRepository.createUser({
      username,
      password,
      metadata: {
        [USER_SERVICE_META]: {
          role,
        },
      },
    });

    this.eventBus.publish(new UserCreatedEvent(user));
    return user;
  }

  private catchError(error: unknown) {
    if (error instanceof DatabaseConflictException) {
      return new DublicatedUserException();
    }
    return error;
  }

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    try {
      return await this.createUser(command);
    } catch (error) {
      throw this.catchError(error);
    }
  }
}
