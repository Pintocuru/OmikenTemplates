// [root] vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export const ENV = {
 // development:開発環境設定
 development: {
  vuePath: 'https://unpkg.com/vue@3/dist/vue.global.js',
  onesdkPath: path.resolve(__dirname, './public/onesdk.js')
 },
 // production:本番環境設定
 production: {
  vuePath: '../__origin/js/vue3.min.js',
  onesdkPath: '../__origin/js/onesdk.js'
 }
};

export function baseViteConfig(childDir: string, mode = 'development', isOneSDK = true) {
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
  },
  build: {
   outDir: path.resolve(childDir, 'dist'),
   rollupOptions: {
    external: isOneSDK ? ['vue', '@onecomme.com/onesdk'] : ['vue']
   }
  },
  define: {
   'process.env': JSON.stringify(mode)
  }
 });
}
