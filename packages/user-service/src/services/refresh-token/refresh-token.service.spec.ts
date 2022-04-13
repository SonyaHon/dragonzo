import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  MongooseRefreshToken,
  RefreshTokenDocument,
  RefreshTokenSchema,
} from '../../schemas/refresh-token.schema';
import { RefreshTokenService } from './refresh-token.service';
import mongoose, { Model } from 'mongoose';
import { InvalidRefreshTokenException } from './refresh-token.exceptions';

describe('RefreshToken Service', () => {
  const tokenLifetime = 1000 * 1; // 1 second;

  let service: RefreshTokenService;
  let mongoInstance: MongoMemoryServer;
  let refreshTokneModel: Model<RefreshTokenDocument>;

  beforeAll(async () => {
    mongoInstance = await MongoMemoryServer.create();
    await mongoose.connect(mongoInstance.getUri());
    refreshTokneModel = mongoose.model<RefreshTokenDocument>(
      MongooseRefreshToken.name,
      RefreshTokenSchema,
    );
    service = new RefreshTokenService(refreshTokneModel, tokenLifetime);
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await refreshTokneModel.ensureIndexes();
    service = new RefreshTokenService(refreshTokneModel, tokenLifetime);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoInstance.stop();
  });

  test('Generate', async () => {
    const token = await service.generate('some-user-id');
    expect(!!token).toBe(true);
  });

  test('Validate', async () => {
    const token = await service.generate('some-user-id');
    const result = await service.validate(token);
    expect(result.token).toEqual(token);
  });

  test('Validate should throw if token not found', async () => {
    await expect(async () => {
      await service.validate('incorrect-refresh-token');
    }).rejects.toBeInstanceOf(InvalidRefreshTokenException);
  });

  test('Validate should throw if token is outdated', async () => {
    await expect(async () => {
      const token = await service.generate('some-user-id');
      await new Promise<void>((resolve) => setTimeout(resolve, 1000 * 1.5)); // sleep for 1.5 secs
      await service.validate(token);
    }).rejects.toBeInstanceOf(InvalidRefreshTokenException);
  });

  test('Remove token', async () => {
    const token = await service.generate('some-user-id');
    await service.remove(token);
    await expect(async () => {
      await service.validate(token);
    }).rejects.toBeInstanceOf(InvalidRefreshTokenException);
  });
});
