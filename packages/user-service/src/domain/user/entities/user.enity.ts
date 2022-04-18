import { DateTime } from 'luxon';

import { BaseEntity } from '../../../lib/base/base.entity';
import { UserNevetLoggedInException } from '../exceptions/user-never-logged-in.exception';
import { Metadata } from './user.metadata';
import { UserRole } from './user.role';

export interface IUserProps {
  id: string;
  username: string;
  password: string;
  metadata: Record<string, unknown>;
  lastTimeLoggedIn?: number;
}

export const USER_SERVICE_META = 'user-service';
export interface IUserServiceMeta {
  role: UserRole;
}

export class UserEntity extends BaseEntity {
  private readonly username: string;
  private readonly password: string;
  private readonly metadata: Metadata;
  private readonly lastTimeLoggedIn: number | null;

  constructor(props: IUserProps) {
    const { id, username, password, metadata, lastTimeLoggedIn } = props;
    super(id);
    this.username = username;
    this.password = password;
    this.metadata = new Metadata(metadata);
    this.lastTimeLoggedIn = lastTimeLoggedIn || null;
  }

  private getUserServiceMeta() {
    return this.metadata.getFor<IUserServiceMeta>(USER_SERVICE_META);
  }

  /**
   * @throws UserMetaNotFoundException
   */
  getMeta<T extends Record<any, any>>(key: string) {
    return this.metadata.getFor<T>(key);
  }

  getMetaForEveryAudience(): Record<string, unknown> {
    return JSON.parse(JSON.stringify(this.metadata.getAll()));
  }

  getUsername() {
    return this.username;
  }

  getPassword() {
    return this.password;
  }

  getRole() {
    return this.getUserServiceMeta().role;
  }

  getLastTimeLoggedInAsTimestamp() {
    if (this.lastTimeLoggedIn === null) {
      throw new UserNevetLoggedInException();
    }
    return this.lastTimeLoggedIn;
  }

  getLastTimeLoggedInAsDate() {
    if (this.lastTimeLoggedIn === null) {
      throw new UserNevetLoggedInException();
    }
    return DateTime.fromMillis(this.lastTimeLoggedIn);
  }

  isRoot() {
    return this.getUserServiceMeta().role === UserRole.Root;
  }

  isUser() {
    return this.getUserServiceMeta().role === UserRole.User;
  }
}
