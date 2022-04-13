import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { BootstrapModule } from './bootstrap/bootstrap.module';

(async () => {
  const app = await NestFactory.create(BootstrapModule, {});
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://dragonzo_rabbitmq:5672'],
      queue: 'user-service',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
})().catch((error) => console.error(error));
