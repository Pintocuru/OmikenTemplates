// src/MainGenerator/utils/hitTable.ts

/**
 * ヒットテーブルエントリの型定義
 */
export interface HitTableEntry {
 name: string;
 numerator: number;
 rank: number;
 effectId: number;
}

/**
 * ヒット結果の型定義
 */
export interface HitResult {
 rank: number;
 name: string | null;
 effectId: number | null;
}

/**
 * 確定役の抽選テーブル
 */
export const hitTable: HitTableEntry[] = [
 { name: '全回転GOD', numerator: 1, rank: 4, effectId: 41 },
 { name: 'GOD', numerator: 7, rank: 3, effectId: 31 }, // 1/8192
 { name: '赤7揃い', numerator: 12, rank: 2, effectId: 24 }, // 1/4096
 { name: '冥王揃い', numerator: 3, rank: 2, effectId: 23 }, // 1/21845
 { name: '紫7揃い', numerator: 10, rank: 2, effectId: 22 }, // 1/6553.6
 { name: '青7揃い', numerator: 10, rank: 2, effectId: 21 }, // 1/6553.6
 { name: 'GOGO', numerator: 240, rank: 1, effectId: 13 }, // 1/200
 { name: 'ハイビスカス', numerator: 240, rank: 1, effectId: 12 }, // 1/200
 { name: 'パトランプ', numerator: 240, rank: 1, effectId: 11 } // 1/200
];

/**
 * ヒット役の抽選を行う
 * @return {HitResult} 抽選結果（ランク、名前、エフェクトID）
 */
export function getHitResult(): HitResult {
 const draw = Math.floor(Math.random() * 65536); // 0〜65535 の整数

 let cumulative = 0;
 for (const { name, numerator, rank, effectId } of hitTable) {
  cumulative += numerator;
  if (draw < cumulative) {
   return { rank, name, effectId };
  }
 }

 // ハズレの場合
 return { rank: 0, name: null, effectId: null };
}
