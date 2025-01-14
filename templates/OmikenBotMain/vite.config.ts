// vite.config.ts
import { defineConfig, mergeConfig } from 'vite';
import { sharedConfig } from '../../vite.shared';

export default mergeConfig(
 sharedConfig,
 defineConfig({
  root: __dirname
 })
);
