// src/types.ts
import { ConfigUserType } from '@public/common/commonTypes';

// stateの型定義
export type WordCounterState = {
 isInitFlag: boolean; // わんコメ初期化フラグ
 commentCount: number; // fetchCommentsで取得した基本コメント数
 userCount: number; // fetchCommentsで取得した基本ユーザー数
 syokenCount: number; // fetchCommentsで取得した基本ユーザー数のうち、初見さん
 manualAdjustment: number; // 手動で加算・減算した数値
};

// ---

// グローバル変数の型定義
declare global {
 interface Window {
  AppComponent: {
   component: any;
   initApp: any;
  };
  counterSets: CounterSet[];
 }
}

export type CounterSet = {
 id: string;
 userVisits: ConfigUserType;
 generator: GeneratorConfig;
 counter: CounterConfig;
};

export interface GeneratorConfig {
 title: string; // 項目名
 theme: ThemeType; // テーマ
 colorMode: ColorMode; // 色モード
 scale: number; // 倍率
}

// テーマのリスト
export const themes = [
 'light',
 'dark',
 'cupcake',
 'bumblebee',
 'emerald',
 'corporate',
 'synthwave',
 'retro',
 'cyberpunk',
 'valentine',
 'halloween',
 'garden',
 'forest',
 'aqua',
 'lofi',
 'pastel',
 'fantasy',
 'wireframe',
 'black',
 'luxury',
 'dracula',
 'cmyk',
 'autumn',
 'business',
 'acid',
 'lemonade',
 'night',
 'coffee',
 'winter',
 'dim',
 'nord',
 'sunset',
 'caramellatte',
 'abyss',
 'silk'
] as const;
export type ThemeType = (typeof themes)[number];

export const colors = [
 'primary',
 'secondary',
 'accent',
 'neutral',
 'info',
 'success',
 'warning',
 'error'
] as const;
export type ColorMode = (typeof colors)[number];

export interface CounterConfig {
 COUNT_MODE:
  | 'comment' // コメント数をカウント
  | 'user' // ユーザー数をカウント
  | 'syoken' // ユーザー数の初見さんをカウント
  | 'total'; // カウンターすべての合計値
 TARGET_DOWN: number; // 1以上ある場合、カウントダウンモードになる
 MULTIPLIER: number; // 振る舞いに掛け算を適用する場合の乗数
 PARTY: Record<number, string>; // WordPartyの発火タイミング
 PARTY_EVENT: string; // カウント増加時に発火するWordParty
 PARTY_SUCCESS: string; // TARGET_COUNT達成時に発火するWordParty
}
