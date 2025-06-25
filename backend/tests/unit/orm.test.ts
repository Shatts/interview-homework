import { MikroORM } from '@mikro-orm/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initORM, orm as ormInstance } from '../../src/orm.js';
import { DatabaseSeeder } from '../../src/seeders/database-seeder.js';

vi.mock('@mikro-orm/core', async () => {
  const actual =
    await vi.importActual<typeof import('@mikro-orm/core')>('@mikro-orm/core');

  return {
    ...actual,
    MikroORM: {
      init: vi.fn(),
    },
  };
});

describe('initORM', () => {
  const mockSeed = vi.fn();
  const mockRefresh = vi.fn();
  const mockGetSeeder = vi.fn(() => ({ seed: mockSeed }));
  const mockGetSchemaGenerator = vi.fn(() => ({
    refreshDatabase: mockRefresh,
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes ORM and runs seeder', async () => {
    const spy = (
      MikroORM.init as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      getSchemaGenerator: mockGetSchemaGenerator,
      getSeeder: mockGetSeeder,
    });

    const orm = await initORM();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(mockGetSeeder).toHaveBeenCalled();
    expect(mockSeed).toHaveBeenCalledWith(DatabaseSeeder);
    expect(ormInstance).toBe(orm);
  });
});
