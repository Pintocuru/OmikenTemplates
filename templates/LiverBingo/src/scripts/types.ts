// src/scripts/types.ts
import { BingoConfig } from './schema';

// グローバル変数の型定義
declare global {
 interface Window {
  BINGO_CONFIG?: BingoConfig;
 }
}
