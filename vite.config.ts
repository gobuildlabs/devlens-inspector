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
    rollupOptions: {
      // Externalize all dependencies - don't bundle them
      external: (id) => {
        // Keep only relative imports, externalize everything else
        return !id.startsWith('.') && !id.startsWith('/');
      }
    },
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true
  }
});
