import { UserEntity } from '../entities';

export interface ICreateUserOverrides {
  id?: string;
  username?: string;
  password?: string;
  lastTimeLoggedIn?: number;
  metadata?: Record<string, unknown>;
}

export const createUserEntity = (overrides: ICreateUserOverrides = {}) => {
  return new UserEntity({
    id: 'id',
    username: 'username',
    password: 'password',
    metadata: {},
    lastTimeLoggedIn: null,
    ...overrides,
  });
};
