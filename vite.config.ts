import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vitest/config';
import { parse } from 'yaml';

// Turns translation files (src/i18n/*.yml) into JSON modules at build time, so the app ships no YAML parser.
const yamlPlugin = (): Plugin => ({
  name: 'yaml',
  transform(code, id) {
    if (!id.endsWith('.yml')) {
      return null;
    }
    return { code: `export default ${JSON.stringify(parse(code))};`, map: null };
  },
});

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss(), yamlPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    clearMocks: true,
    unstubGlobals: true,
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/tests/**', 'src/**/*.test.{ts,tsx}', 'src/vite-env.d.ts'],
    },
  },
});
