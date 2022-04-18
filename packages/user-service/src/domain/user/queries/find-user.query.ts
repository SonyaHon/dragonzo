export type IFinderUserQueryFilter = { id: string } | { username: string };

export class FindUserQuery {
  private readonly value: string;
  private readonly byId: boolean;

  constructor(filter: IFinderUserQueryFilter) {
    if ('id' in filter) {
      this.value = filter.id;
      this.byId = true;
    } else {
      this.value = filter.username;
      this.byId = false;
    }
  }

  isById() {
    return this.byId;
  }

  getValue() {
    return this.value;
  }
}
