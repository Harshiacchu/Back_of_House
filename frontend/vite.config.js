import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// In dev, Vite proxies /api to Express so the browser sees one origin (no CORS needed).
// In production, Express serves frontend/dist itself.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
