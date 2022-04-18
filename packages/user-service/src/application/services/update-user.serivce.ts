import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRepositoryAdapter } from '../../adapters/database/user-repository.adapter';
import { DatabaseNotFoundException } from '../../adapters/exceptions/database-not-found.exception';
import { UpdateUserCommand } from '../../domain/user/commands/update-user.command';
import { UserEntity } from '../../domain/user/entities';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

@CommandHandler(UpdateUserCommand)
export class UpdateUserService implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userRepository: UserRepositoryAdapter,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserEntity> {
    try {
      return await this.updateUser(command);
    } catch (error) {
      throw this.catchError(error);
    }
  }

  private async updateUser({
    user,
    audience,
    newMeta,
  }: UpdateUserCommand): Promise<UserEntity> {
    const meta: Record<string, unknown> = {
      ...user.getMetaForEveryAudience(),
      [audience]: newMeta,
    };
    // @TODO: Workout typings
    return await this.userRepository.updateUserMeta(user, meta as any);
  }

  private catchError(error: unknown) {
    if (error instanceof DatabaseNotFoundException) {
      return new UserNotFoundException();
    }
    return error;
  }
}
