import { HttpStatus } from '@nestjs/common';
import { BaseApplicationException } from '../../lib/base/base.application.exception';

export class UserNotFoundException extends BaseApplicationException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}
