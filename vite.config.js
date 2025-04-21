// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@page': path.resolve(__dirname, './src/page'),
      '@component': path.resolve(__dirname, './src/component'),
    },
  },
  optimizeDeps: {
    include: ['zustand'],
  },
});
