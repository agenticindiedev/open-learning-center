import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@collections': path.resolve(__dirname, 'src/collections'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@guards': path.resolve(__dirname, 'src/guards'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.spec.ts', '**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.next', 'build'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['apps/**/src/**/*.ts'],
      exclude: ['**/*.spec.ts', '**/*.test.ts', '**/*.d.ts', '**/main.ts', '**/index.ts'],
      thresholds: {
        lines: 50,
        functions: 40,
        branches: 30,
        statements: 50,
      },
    },
    mockReset: true,
    restoreMocks: true,
  },
});
