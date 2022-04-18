import { HttpStatus } from '@nestjs/common';
import { BaseDomainException } from '../../../lib/base/base.domain-exception';

export class UserNevetLoggedInException extends BaseDomainException {
  constructor() {
    super('User has never logged in', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
