import { BaseDomainException } from './base.domain-exception';

export abstract class BaseApplicationException extends BaseDomainException {
  override isDomainException(): boolean {
    return false;
  }

  isApplicationException() {
    return true;
  }
}
