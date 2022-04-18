import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { hash } from 'bcryptjs';
import { EncryptPasswordQuery } from '../../domain/user/queries/encrypt-password.query';

@QueryHandler(EncryptPasswordQuery)
export class EncryptPasswordService
  implements IQueryHandler<EncryptPasswordQuery>
{
  private static SaltRounds = 13;

  async execute({ rawPassword }: EncryptPasswordQuery): Promise<string> {
    return await hash(rawPassword, EncryptPasswordService.SaltRounds);
  }
}
