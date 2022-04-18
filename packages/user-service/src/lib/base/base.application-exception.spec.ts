import { HttpStatus } from '@nestjs/common';
import { BaseApplicationException } from './base.application.exception';

describe('Base application exception', () => {
  class Test extends BaseApplicationException {}

  const exception = new Test('error', HttpStatus.INTERNAL_SERVER_ERROR);

  test('Checks', () => {
    expect(exception).toBeInstanceOf(BaseApplicationException);
    expect(exception.isDomainException()).toBe(false);
    expect(exception.isApplicationException()).toBe(true);
  });
});
