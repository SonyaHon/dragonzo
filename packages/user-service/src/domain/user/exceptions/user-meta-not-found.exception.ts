import { HttpStatus } from '@nestjs/common';
import { BaseDomainException } from '../../../lib/base/base.domain-exception';

export class UserMetaNotFoundException extends BaseDomainException {
  constructor() {
    super('User meta not found', HttpStatus.NOT_FOUND);
  }
}
