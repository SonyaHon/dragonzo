import { HttpStatus } from '@nestjs/common';

export class BaseAdapterException extends Error {
  public code: HttpStatus;
  constructor(message: string, code: HttpStatus) {
    super(message);
    this.code = code;
  }
}
