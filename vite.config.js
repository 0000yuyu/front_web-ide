// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: '/',
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
  server: {
    proxy: {
      '/api/ws': {
        target: 'ws://43.202.161.69:8080/ws/chat', // 웹소켓은 ws://
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api': {
        target: 'http://43.202.161.69:8080/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // 백엔드 서버에는 /api 빼고 전달
      },
    },
  },
});
