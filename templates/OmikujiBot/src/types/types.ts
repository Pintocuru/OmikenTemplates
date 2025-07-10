// src/types.ts
import { ConfigUserType } from '@public/common/types/ConfigTypes';
import { CharacterColorScheme } from './PresetTypes';
import { OmikujiDataType } from './OmikujiTypesSchema';

// BotMessage Commentを大幅に略したもの
export type BotMessage = {
 id: string; // 一意のid
 name: string; // 表示する名前
 profileImage: string | null; // アイコン
 timestamp: string; // 投稿日時
 comment: string; // コメント
 isToast: boolean; // 通常表示かトースト表示か
 color: CharacterColorScheme; // カラー
 delaySeconds: number; // 投稿までの遅延時間（秒）
};

export type DisplaySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// サイズ設定の定数
export const SIZE_CONFIG = {
 text: {
  xs: { name: 'text-2xl', comment: 'text-xl', lineHeight: 'leading-8' },
  sm: { name: 'text-3xl', comment: 'text-2xl', lineHeight: 'leading-10' },
  md: { name: 'text-4xl', comment: 'text-3xl', lineHeight: 'leading-12' },
  lg: { name: 'text-5xl', comment: 'text-4xl', lineHeight: 'leading-14' },
  xl: { name: 'text-6xl', comment: 'text-5xl', lineHeight: 'leading-16' }
 },
 icon: {
  xs: { size: 'w-48 h-48', top: '280px', spacing: 80 },
  sm: { size: 'w-64 h-64', top: '320px', spacing: 100 },
  md: { size: 'w-80 h-80', top: '350px', spacing: 120 },
  lg: { size: 'w-96 h-96', top: '380px', spacing: 140 },
  xl: { size: 'w-112 h-112', top: '420px', spacing: 160 }
 }
} as const;

// ---

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG: ConfigUserType;
  omikujiData: OmikujiDataType;
 }
}
