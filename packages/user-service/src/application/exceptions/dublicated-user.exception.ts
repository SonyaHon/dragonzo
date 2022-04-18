import { HttpStatus } from '@nestjs/common';
import { BaseApplicationException } from '../../lib/base/base.application.exception';

export class DublicatedUserException extends BaseApplicationException {
  constructor() {
    super('User is dublicated', HttpStatus.CONFLICT);
  }
}
