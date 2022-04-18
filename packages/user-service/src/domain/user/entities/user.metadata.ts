import { UserMetaNotFoundException } from '../exceptions/user-meta-not-found.exception';

export class Metadata {
  private readonly data: Record<string, unknown>;

  constructor(initialMetadata: Record<string, unknown> = {}) {
    this.data = initialMetadata;
  }

  /**
   * @throws UserMetaNotFoundException
   */
  getFor<T extends Record<any, any>>(key: string): T {
    const meta = this.data[key] as T;
    if (!meta) {
      throw new UserMetaNotFoundException();
    }
    return meta;
  }

  getAll(): Record<string, unknown> {
    return this.data;
  }
}
