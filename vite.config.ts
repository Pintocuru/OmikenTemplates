// [root] vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export function baseViteConfig(childDir: string) {
 return defineConfig({
  root: childDir,
  plugins: [vue()],
  cacheDir: path.resolve(__dirname, 'node_modules/.vite'),
  resolve: {
   alias: {
    '@type': path.resolve(__dirname, 'public/types'),
    '@public': path.resolve(__dirname, 'public'),
    '@common': path.resolve(__dirname, 'public/common')
   }
  }
 });
}
