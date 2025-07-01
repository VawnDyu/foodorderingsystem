import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.VITE_DEV_HOST,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, process.env.VITE_DEV_HTTPS_KEY)),
      cert: fs.readFileSync(path.resolve(__dirname, process.env.VITE_DEV_HTTPS_CERT)),
    },
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_PROXY,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
