import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRepositoryAdapter } from '../../adapters/database/user-repository.adapter';
import { DatabaseNotFoundException } from '../../adapters/exceptions/database-not-found.exception';
import { DeleteUserCommand } from '../../domain/user/commands/delete-user.command';
import { UserEntity } from '../../domain/user/entities';
import { UserDeletedEvent } from '../../domain/user/events/user-deleted.event';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

@CommandHandler(DeleteUserCommand)
export class DeleteUserService implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly userRepository: UserRepositoryAdapter,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ user }: DeleteUserCommand): Promise<any> {
    try {
      await this.deleteUser(user);
      await this.eventBus.publish(new UserDeletedEvent(user));
    } catch (error) {
      throw this.catchError(error);
    }
  }

  private catchError(error: unknown) {
    if (error instanceof DatabaseNotFoundException) {
      return new UserNotFoundException();
    }
    return error;
  }

  private async deleteUser(user: UserEntity) {
    await this.userRepository.deleteUser(user);
  }
}
