import { HttpStatus } from '@nestjs/common';
import { BaseAdapterException } from '../../lib/base/base.adapter-exception';

export class DatabaseNotFoundException extends BaseAdapterException {
  constructor() {
    super('Entity not found', HttpStatus.NOT_FOUND);
  }
}
