import { BaseEntity } from './base.entity';

describe('Base entity', () => {
  class Test extends BaseEntity {}

  test('Creatable', () => {
    const t = new Test('id');
    expect(t).toBeInstanceOf(BaseEntity);
    expect(t.getId()).toBe('id');
  });

  test('Equality', () => {
    const t1 = new Test('id');
    const t2 = new Test('id');
    const t3 = new Test('another-id');

    expect(t1.equals(t2)).toBe(true);
    expect(t1.equals(t3)).toBe(false);
  });
});
