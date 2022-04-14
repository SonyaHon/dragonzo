import { BootstrapModule } from './bootstrap/bootstrap.module';

export const bootstrap = async () => {
  const app = await BootstrapModule.Bootstrap();
  await app.startAllMicroservices();
  await app.listen(3000);
};

(async () => {
  await bootstrap();
})().catch((error) => console.error(error));
