import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRefreshTokenCommand } from '../../domain/refresh-token/commands/delete-refresh-token.command';
import { RefreshTokenRepositoryAdapter } from '../../adapters/database/refresh-token-repository.adapter';
import { DatabaseNotFoundException } from '../../adapters/exceptions/database-not-found.exception';
import { RefreshTokenNotFoundException } from '../../domain/refresh-token/exceptions/refresh-token-not-found.exception';

@CommandHandler(DeleteRefreshTokenCommand)
export class DeleteRefreshTokenService
  implements ICommandHandler<DeleteRefreshTokenCommand>
{
  constructor(
    public readonly refreshTokenRepository: RefreshTokenRepositoryAdapter,
  ) {}
  async execute({ refreshToken }: DeleteRefreshTokenCommand): Promise<void> {
    try {
      await this.refreshTokenRepository.deleteToken(refreshToken);
    } catch (error) {
      if (error instanceof DatabaseNotFoundException) {
        throw new RefreshTokenNotFoundException();
      }
      throw error;
    }
  }
}
