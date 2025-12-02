import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'Inspector',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.esm.js';
        if (format === 'umd') return 'index.js';
        return `index.${format}.js`;
      }
    },
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true
  }
});
