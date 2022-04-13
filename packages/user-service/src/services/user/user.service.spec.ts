import { verify } from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model } from 'mongoose';
import {
  MongooseUser,
  UserDocument,
  UserSchema,
} from '../../schemas/user.schema';
import {
  MongooseRefreshToken,
  RefreshTokenDocument,
  RefreshTokenSchema,
} from '../../schemas/refresh-token.schema';
import { CryptoService } from '../crypto/crypto.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { UserService } from './user.service';
import {
  DublicatedUserException,
  InvalidCredentialsException,
  UserNotFoundException,
} from './user.service.exceptions';
import { InvalidRefreshTokenException } from '../refresh-token/refresh-token.exceptions';

describe('User Service', () => {
  const jwtSignKey = 'secret';
  const jwtExpiration = 1000 * 60; // 1 minute;
  const refreshLifetime = 1000 * 1; // 1 sec;

  let service: UserService;
  let refreshTokenService: RefreshTokenService;
  let mongoInstance: MongoMemoryServer;
  let userModel: Model<UserDocument>;
  let refreshTokenModel: Model<RefreshTokenDocument>;

  beforeAll(async () => {
    mongoInstance = await MongoMemoryServer.create();
    await mongoose.connect(mongoInstance.getUri());
    userModel = mongoose.model<UserDocument>(MongooseUser.name, UserSchema);
    refreshTokenModel = mongoose.model<RefreshTokenDocument>(
      MongooseRefreshToken.name,
      RefreshTokenSchema,
    );
    refreshTokenService = new RefreshTokenService(
      refreshTokenModel,
      refreshLifetime,
    );
    service = new UserService(
      userModel,
      new CryptoService(),
      refreshTokenService,
      jwtSignKey,
      jwtExpiration,
    );
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await userModel.ensureIndexes();
    await refreshTokenModel.ensureIndexes();
    refreshTokenService = new RefreshTokenService(
      refreshTokenModel,
      refreshLifetime,
    );
    service = new UserService(
      userModel,
      new CryptoService(),
      refreshTokenService,
      jwtSignKey,
      jwtExpiration,
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoInstance.stop();
  });

  test('Dummy', () => {
    expect(service).toBeDefined();
  });

  test('Create user', async () => {
    const document = await service.createUser('username', 'password');
    expect(document.username).toBe('username');
    expect(document.password).not.toBe('password');
  });

  test('Duplicat should throw', async () => {
    await expect(async () => {
      await service.createUser('username', 'password');
      await service.createUser('username', 'password');
    }).rejects.toBeInstanceOf(DublicatedUserException);
  });

  test('FindUserByUsername', async () => {
    const registeredUser = await service.createUser('username', 'password');
    const foundUser = await service.findUserByUsername('username');
    expect(foundUser._id).toEqual(registeredUser._id);
  });

  test('FindUserByUsername throws if user not found', async () => {
    await expect(async () => {
      await service.findUserByUsername('username');
    }).rejects.toBeInstanceOf(UserNotFoundException);
  });

  test('FindUserById', async () => {
    const registeredUser = await service.createUser('username', 'password');
    const foundUser = await service.findUserById(registeredUser.id);
    expect(foundUser._id).toEqual(registeredUser._id);
  });

  test('FindUserById throws if user not found', async () => {
    await expect(async () => {
      await service.findUserById(new mongoose.Types.ObjectId().toHexString());
    }).rejects.toBeInstanceOf(UserNotFoundException);
  });

  test('Authenticate', async () => {
    const registeredUser = await service.createUser('username', 'password');
    const { access, refresh } = await service.authenticate(
      'username',
      'password',
    );
    const validate = verify(access, jwtSignKey);
    expect(validate.sub).toBe(registeredUser.id);
    expect(!!refresh).toBe(true);
  });

  test('Authenticate should throw if user not found', async () => {
    await expect(async () => {
      await service.authenticate('username', 'password');
    }).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  test('Authenticate should throw if password is invalid', async () => {
    await service.createUser('username', 'password');
    await expect(async () => {
      await service.authenticate('username', 'wrong-password');
    }).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  test('Refresh tokens', async () => {
    const registeredUser = await service.createUser('username', 'password');
    const { refresh } = await service.authenticate('username', 'password');
    const { access: refreshAccess, refresh: refreshedRefresh } =
      await service.refreshTokens(refresh);

    const validate = verify(refreshAccess, jwtSignKey);
    expect(validate.sub).toBe(registeredUser.id);
    expect(refresh).not.toBe(refreshedRefresh);
  });

  test('Should not refresh if token does not exist', async () => {
    await service.createUser('username', 'password');
    const { refresh } = await service.authenticate('username', 'password');
    await refreshTokenService.remove(refresh);
    await expect(async () => {
      await service.refreshTokens(refresh);
    }).rejects.toBeInstanceOf(InvalidRefreshTokenException);
  });
});
