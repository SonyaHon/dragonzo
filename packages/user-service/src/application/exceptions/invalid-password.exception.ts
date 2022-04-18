import { HttpStatus } from '@nestjs/common';
import { BaseApplicationException } from '../../lib/base/base.application.exception';

export class InvalidPasswordException extends BaseApplicationException {
  constructor() {
    super('Invalid password', HttpStatus.UNAUTHORIZED);
  }
}
