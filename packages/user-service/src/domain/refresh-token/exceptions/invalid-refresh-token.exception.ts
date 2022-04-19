import { BaseApplicationException } from '../../../lib/base/base.application.exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidRefreshTokenException extends BaseApplicationException {
  constructor() {
    super('Invalid refresh token', HttpStatus.BAD_REQUEST);
  }
}
