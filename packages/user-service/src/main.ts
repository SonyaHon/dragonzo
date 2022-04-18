import { NestFactory } from '@nestjs/core';
import { BootstrapModule } from './bootstrap/bootstrap.module';

export const bootstrap = async () => {
  const app = await NestFactory.create(BootstrapModule);
  await app.startAllMicroservices();
  await app.listen(3000);
  return app;
};

(async () => {
  await bootstrap();
})().catch((error) => console.error(error));
