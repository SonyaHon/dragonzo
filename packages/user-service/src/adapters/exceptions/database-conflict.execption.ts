import { HttpStatus } from '@nestjs/common';
import { BaseAdapterException } from '../../lib/base/base.adapter-exception';

export class DatabaseConflictException extends BaseAdapterException {
  constructor() {
    super('Conflict during operation', HttpStatus.CONFLICT);
  }
}
