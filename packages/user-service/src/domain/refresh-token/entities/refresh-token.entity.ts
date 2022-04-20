import { DateTime } from 'luxon';
import { UserEntity } from '../../user/entities';

export interface IRefreshTokenProps {
  token: string;
  createdAt: number;
  audience: string;
  user: UserEntity;
}

export class RefreshTokenEntity {
  private readonly token: string;
  private readonly createdAt: number;
  private readonly user: UserEntity;
  private readonly audience: string;

  constructor(props: IRefreshTokenProps) {
    this.token = props.token;
    this.createdAt = props.createdAt;
    this.audience = props.audience;
    this.user = props.user;
  }

  getAudience() {
    return this.audience;
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
