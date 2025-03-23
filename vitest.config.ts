import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./calculator/src/test/setup.ts'],
    include: ['**/*.test.{js,ts,jsx,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
}); 