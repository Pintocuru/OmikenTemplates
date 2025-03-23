// types.ts

// 難易度別アイテムの型
export interface BingoItem {
 text: string; // お題
 weight?: number; // 出現率
 value?: [number, number, number, number, number] | number; // levelごとの規定数
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

// 紙吹雪スタイルの型
export interface ConfettiStyle {
 left: string;
 width: string;
 height: string;
 backgroundColor: string;
 animationDuration: string;
 animationDelay: string;
}

// 紙吹雪の型
export interface Confetti {
 style: ConfettiStyle;
}
