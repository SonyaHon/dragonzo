import { HttpStatus } from '@nestjs/common';
import { BaseDomainException } from './base.domain-exception';

describe('Domain exception', () => {
  class Test extends BaseDomainException {}

  const exception = new Test('message', HttpStatus.INTERNAL_SERVER_ERROR);

  test('Checks', () => {
    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception.isDomainException()).toBe(true);
  });
});
