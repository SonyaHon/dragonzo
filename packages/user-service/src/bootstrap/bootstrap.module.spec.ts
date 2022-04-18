import { BootstrapModule } from './bootstrap.module';

describe('Bootstrap module', () => {
  test('Craftable', () => {
    expect(new BootstrapModule()).toBeInstanceOf(BootstrapModule);
  });
});
