import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      api: path.resolve(__dirname, 'src/api'),
      components: path.resolve(__dirname, 'src/components'),
      navigate: path.resolve(__dirname, 'src/navigate'),
      stores: path.resolve(__dirname, 'src/stores')
    }
  }
});
