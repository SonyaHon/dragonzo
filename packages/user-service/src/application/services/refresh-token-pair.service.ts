import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { RefreshTokenPairCommand } from '../../domain/token-pair/commands/refresh-token-pair.command';
import { TokenPair } from '../../domain/token-pair/entities/token-pair.entity';
import { GenerateTokenPairCommand } from '../../domain/token-pair/commands/generate-token-pair.command';
import { ValidateRefreshTokenQuery } from '../../domain/refresh-token/queries/validate-refresh-token.query';
import { DeleteRefreshTokenCommand } from '../../domain/refresh-token/commands/delete-refresh-token.command';

@CommandHandler(RefreshTokenPairCommand)
export class RefreshTokenPairService
  implements ICommandHandler<RefreshTokenPairCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute({
    refreshToken,
    audience,
  }: RefreshTokenPairCommand): Promise<TokenPair> {
    await this.queryBus.execute(
      new ValidateRefreshTokenQuery(refreshToken, audience),
    );
    await this.commandBus.execute(new DeleteRefreshTokenCommand(refreshToken));
    return await this.commandBus.execute(
      new GenerateTokenPairCommand(refreshToken.getUser(), audience),
    );
  }
}
