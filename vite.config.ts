import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      api: path.resolve(__dirname, 'src/api'),
      data: path.resolve(__dirname, 'src/data'),
      page: path.resolve(__dirname, 'src/page'),
      components: path.resolve(__dirname, 'src/components'),
      navigate: path.resolve(__dirname, 'src/navigate'),
      stores: path.resolve(__dirname, 'src/stores'),
      utils: path.resolve(__dirname, 'src/utils')
    }
  }
});
