// [packages] vite.config.ts
import { baseViteConfig } from '../../vite.config';
import path from 'path';
import { defineConfig, mergeConfig } from 'vite';

// ホットリロード用設定
export default defineConfig(() => {
 return mergeConfig(baseViteConfig(__dirname), {
  resolve: {
   alias: {
    '@': path.resolve(__dirname, 'src'),
    '@assets': path.resolve(__dirname, 'assets')
   }
  }
 });
});
