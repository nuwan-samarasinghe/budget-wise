import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: { plugins: [tailwindcss()] },
  },
  server: {
    host: true,
    port: 5173,
    watch: { usePolling: true },
  },
});
