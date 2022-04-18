import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../domain/user/entities';
import { AuthenticateUserQuery } from '../../domain/user/queries/authenticate-user.query';
import { FindUserQuery } from '../../domain/user/queries/find-user.query';
import { ValidateUserPasswordQuery } from '../../domain/user/queries/validate-user-password.query';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { InvalidPasswordException } from '../exceptions/invalid-password.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

@QueryHandler(AuthenticateUserQuery)
export class AuthenticateUserService
  implements IQueryHandler<AuthenticateUserQuery>
{
  constructor(private readonly queryBus: QueryBus) {}

  async execute(data: AuthenticateUserQuery): Promise<UserEntity> {
    try {
      return await this.authenticate(data);
    } catch (error) {
      throw this.catchError(error);
    }
  }

  private catchError(error: unknown) {
    if (
      error instanceof UserNotFoundException ||
      error instanceof InvalidPasswordException
    ) {
      return new InvalidCredentialsException();
    }
    return error;
  }

  private async authenticate({ username, password }: AuthenticateUserQuery) {
    const user = await this.queryBus.execute(
      new FindUserQuery({
        username,
      }),
    );
    await this.queryBus.execute(new ValidateUserPasswordQuery(user, password));
    return user;
  }
}
