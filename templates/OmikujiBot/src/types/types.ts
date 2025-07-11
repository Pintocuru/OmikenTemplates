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

// ---

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG: ConfigUserType;
  omikujiData: OmikujiDataType;
 }
}
