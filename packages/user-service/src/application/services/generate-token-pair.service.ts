import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { GenerateRefreshTokenCommand } from '../../domain/refresh-token/commands/generate-refresh-token.command';
import { TokenPair } from '../../domain/token-pair/entities/token-pair.entity';
import { GenerateTokenPairCommand } from '../../domain/token-pair/commands/generate-token-pair.command';
import { GenerateJWTQuery } from '../../domain/user/queries/generate-jwt.query';

@CommandHandler(GenerateTokenPairCommand)
export class GenerateTokenPairService
  implements ICommandHandler<GenerateTokenPairCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute({ user, audience }: GenerateTokenPairCommand): Promise<any> {
    const jwt = await this.queryBus.execute(
      new GenerateJWTQuery(user, audience),
    );
    const refreshToken = await this.commandBus.execute(
      new GenerateRefreshTokenCommand(user, audience),
    );
    return new TokenPair(jwt, refreshToken.getToken());
  }
}
