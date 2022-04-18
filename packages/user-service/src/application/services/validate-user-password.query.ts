import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { compare } from 'bcryptjs';
import { ValidateUserPasswordQuery } from '../../domain/user/queries/validate-user-password.query';
import { InvalidPasswordException } from '../exceptions/invalid-password.exception';

@QueryHandler(ValidateUserPasswordQuery)
export class ValidateUserPasswordService
  implements IQueryHandler<ValidateUserPasswordQuery>
{
  async execute({
    user,
    possiblePassword,
  }: ValidateUserPasswordQuery): Promise<void> {
    const result = await compare(possiblePassword, user.getPassword());
    if (result === false) {
      throw new InvalidPasswordException();
    }
  }
}
