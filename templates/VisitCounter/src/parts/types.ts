// src/parts/types.vue
import { ConfigType } from '@common/commonTypes';

export interface UserVisit {
 name: string;
 isFirstVisit: boolean;
 kiriban: boolean;
 timeStamp: number;
 status: string;
}

export interface UserVisits {
 [userId: string]: UserVisit;
}

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG?: ConfigType & ConfigPlusType;
 }
}
// おみくじBOT用の型
export interface ConfigPlusType {
 TEST_USER_COUNT: number; // テストモード
 SVG_MODE: number; // 表示モード
 COLOR_NUMBER: number | string; // カラー
 IS_VISIBLE_USERS: boolean; // ユーザーリストを表示するか
 KIRIBAN: number; // キリ番
 DISALLOWED_USER_IDS: string[]; // 通さないユーザーIDリスト
}
