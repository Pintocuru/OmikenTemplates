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
    '@assets': path.resolve(__dirname, 'assets'),
    '@': path.resolve(__dirname, 'src'),
    '@Config': path.resolve(__dirname, 'src/ConfigMaker'),
    '@ConfigComponents': path.resolve(__dirname, 'src/ConfigMaker/components'),
    '@ConfigScript': path.resolve(__dirname, 'src/ConfigMaker/script')
   }
  }
 });
});
