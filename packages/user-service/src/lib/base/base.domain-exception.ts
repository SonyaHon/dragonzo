import { HttpStatus } from '@nestjs/common';

export abstract class BaseDomainException extends Error {
  public code: HttpStatus;
  constructor(message: string, code: HttpStatus) {
    super(message);
    this.code = code;
  }

  isDomainException() {
    return true;
  }
}
