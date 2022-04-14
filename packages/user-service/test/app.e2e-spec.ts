import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { BootstrapModule } from '../src/bootstrap/bootstrap.module';

describe('App E2E', () => {
  let app: INestApplication;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        BootstrapModule,
        ClientsModule.register([
          {
            name: 'CLIENT',
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://dragonzo_rabbitmq:5672'],
              queue: 'user-service',
            },
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://dragonzo_test_rabbitmq:5672'],
        queue: 'user-service',
      },
    });

    await app.startAllMicroservices();
    await app.init();

    client = app.get('CLIENT');
    await client.connect();
  });

  afterAll(async () => {
    await app.close();
    await client.close();
  });

  test('Dummy', () => {
    expect(true).toBe(true);
  });
});
