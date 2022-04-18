import { DateTime } from 'luxon';
import { UserEntity } from '../../user/entities';

export interface IRefreshTokenProps {
  token: string;
  createdAt: number;
  user: UserEntity;
}

export class RefreshTokenEntity {
  private readonly token: string;
  private readonly createdAt: number;
  private readonly user: UserEntity;

  constructor(props: IRefreshTokenProps) {
    this.token = props.token;
    this.createdAt = props.createdAt;
    this.user = props.user;
  }

  getToken() {
    return this.token;
  }

  getCreatedAtAsTimestamp() {
    return this.createdAt;
  }

  getCreatedAtAsDate() {
    return DateTime.fromMillis(this.createdAt);
  }

  getUser() {
    return this.user;
  }
}
