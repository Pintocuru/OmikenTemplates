// [packages] vite.config.ts
import { baseViteConfig } from '../../vite.config';
import path from 'path';
import { defineConfig, mergeConfig } from 'vite';

// ホットリロード用設定
export default defineConfig(({ mode }) => {
 return mergeConfig(baseViteConfig(__dirname), {
  root: path.resolve(__dirname),
  publicDir: path.resolve(__dirname, '../../public'),
  resolve: {
   alias: {
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@scripts': path.resolve(__dirname, 'src/scripts'),
    '@styles': path.resolve(__dirname, 'src/styles')
   }
  }
 });
});
