import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenRepositoryAdapter } from '../../adapters/database/refresh-token-repository.adapter';
import { GenerateRefreshTokenCommand } from '../../domain/refresh-token/commands/generate-refresh-token.command';

@CommandHandler(GenerateRefreshTokenCommand)
export class GenerateRefreshTokenService
  implements ICommandHandler<GenerateRefreshTokenCommand>
{
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepositoryAdapter,
  ) {}

  async execute({ user, audience }: GenerateRefreshTokenCommand): Promise<any> {
    return await this.refreshTokenRepository.createToken(user, audience);
  }
}
