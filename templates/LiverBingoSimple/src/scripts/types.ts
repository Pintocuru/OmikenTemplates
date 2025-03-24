// types.ts

// 難易度別アイテムの型
export interface BingoItem {
 text: string; // お題
 weight?: number; // 出現率
 values?: [number, number, number, number, number] | number; // levelごとの規定数
 unit?: number; // 単位
 difficulty?: number; // 規定のlevel以上で出現するもの
 /**
  * わんコメで反応させる種類
  * syoken: 初コメしたユーザー数
  * user: keywordsに合致したコメントをしたユーザー数
  * count: keywordsに合致したコメント数
  * consecutive: keywordsに合致したコメント数、連続
  * gift: ギフト回数
  *
  * ・metaを参照するもの
  * visit: 視聴数
  * elapsedTime: 配信の経過時間
  */

 mode?: string; // わんコメで反応させる種類 syoken,count(合計keywords数),consecutive(連続target数)
 keywords?: string[]; // わんコメで反応させるワード
}
export interface BingoCard {
 cardSize: 3 | 4 | 5; // カードサイズ
 theme?: ThemeType; // daisyUiによるテーマ
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

// ---

// 追加configの型定義
export interface BingoConfig {
 bingoItems: BingoItem[];
 bingoCard: BingoCard;
}

// ---

// グローバル変数の型定義
declare global {
 interface Window {
  BINGO_CONFIG?: BingoConfig;
 }
}
