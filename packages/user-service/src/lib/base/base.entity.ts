export abstract class BaseEntity {
  constructor(protected readonly id: string) {}

  getId(): string {
    return this.id;
  }

  equals(other: this) {
    return this.id === other.id;
  }
}
