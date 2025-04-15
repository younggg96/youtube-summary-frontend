import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3000,
    host: true,
    // Remove proxy for local development, connect directly to the local API
    // Uncomment the configuration below if the API is deployed on a different server
    // proxy: {
    //   '/api': {
    //     target: 'http://your-api-server.com',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  }
});
