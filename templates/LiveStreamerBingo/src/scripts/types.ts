// types.ts

// 難易度別アイテムの型
export interface BingoItem {
 text: string; // お題
 weight?: number; // 出現率
 value?: [number, number, number, number, number] | number; // levelごとの規定数
 difficulty?: number; // 規定のlevel以上で出現するもの
 mode?: string; // わんコメで反応させる種類 syoken,count(合計target数),consecutive(連続target数)
 target?: string[]; // わんコメで反応させるワード
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

// ビンゴパターン（勝利条件）の型
export type WinPattern = number[];
