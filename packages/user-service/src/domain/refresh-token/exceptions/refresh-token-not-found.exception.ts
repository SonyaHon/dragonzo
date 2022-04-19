import { BaseApplicationException } from '../../../lib/base/base.application.exception';
import { HttpStatus } from '@nestjs/common';

export class RefreshTokenNotFoundException extends BaseApplicationException {
  constructor() {
    super('Refresh token not found', HttpStatus.NOT_FOUND);
  }
}
