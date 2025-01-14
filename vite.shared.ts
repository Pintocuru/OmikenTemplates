// vite.shared.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export const sharedConfig = defineConfig({
 plugins: [vue()],
 css: {
  postcss: {
   plugins: [require('tailwindcss'), require('autoprefixer')]
  }
 },
 resolve: {
  alias: {
   '@': path.resolve(__dirname, 'src'), // 既存のエイリアス
   '@type': path.resolve(__dirname, 'public/types'), // @type 用のエイリアス
   '@tailwind': path.resolve(__dirname, 'public/tailwind'),
   '@public': path.resolve(__dirname, 'public') // @public 用のエイリアス
  },
  extensions: ['.js', '.ts', '.vue'] // 拡張子を明示
 },
 server: {
  fs: {
   allow: ['..'] // ルート外アクセスを許可
  }
 }
});
