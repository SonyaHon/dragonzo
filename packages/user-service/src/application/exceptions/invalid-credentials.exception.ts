import { HttpStatus } from '@nestjs/common';
import { BaseApplicationException } from '../../lib/base/base.application.exception';

export class InvalidCredentialsException extends BaseApplicationException {
  constructor() {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}
