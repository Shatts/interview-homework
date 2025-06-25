import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'src/config/**',
        'src/orm.ts',
        '**/*.test.ts',
        'src/server.ts',
        'src/container.ts',
        'src/types/**',
        'dist/**',
        'src/seeders/**',
        '**/*-entity.ts',
        '**/*.config.ts',
        '**/*.js',
      ],
      reporter: ['text', 'json', 'html'],
    },
    env: {
      DB_NAME: 'test_db',
      DB_PASSWORD: 'test_pass',
      DB_USER: 'test_user',
    },
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/vitest.setup.ts'],
  },
});
