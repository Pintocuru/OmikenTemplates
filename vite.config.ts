// [root] vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// @ts-ignore 無視しなければ使えないので
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export function baseViteConfig(childDir: string) {
 return defineConfig({
  root: childDir,
  plugins: [vue(), tailwindcss()],
  cacheDir: path.resolve(__dirname, 'node_modules/.vite'),
  resolve: {
   alias: {
    '@type': path.resolve(__dirname, 'public/types'),
    '@public': path.resolve(__dirname, 'public'),
    '@common': path.resolve(__dirname, 'public/common')
   }
  },
  css: {
   postcss: path.resolve(__dirname, 'postcss.config.js')
  }
 });
}
