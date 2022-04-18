import { INestApplication } from '@nestjs/common';
import { PrismaAdapter } from './prisma.adapter';

describe('Prisma adapter', () => {
  const adapter = new PrismaAdapter();
  const app = {
    close: jest.fn(),
  } as unknown as INestApplication;
  adapter.$connect = jest.fn();
  adapter.$on = jest.fn().mockImplementation((event, callback) => {
    callback();
  });

  test('Creation', () => {
    expect(adapter).toBeInstanceOf(PrismaAdapter);
  });

  test('OnModuleInit', () => {
    adapter.onModuleInit();
    expect(adapter.$connect).toBeCalled();
  });

  test('enableShutdownHooks', async () => {
    await adapter.enableShutdownHooks(app);
    expect(adapter.$on).toBeCalled();
    expect(app.close).toBeCalled();
  });
});
