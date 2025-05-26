// src/MainGenerator/utils/LotteryTable.ts
import { LotteryEntry } from '@/types';

// 抽選テーブル（65536分母で確率を設定）
export const lotteryTable: LotteryEntry[] = [
 // 確定役
 { name: '全回転GOD', numerator: 1, rank: 4, effectId: 41, badgeImg: '' },
 { name: 'GOD', numerator: 7777, rank: 3, effectId: 31, badgeImg: '' },
 { name: '赤7揃い', numerator: 12, rank: 2, effectId: 24, badgeImg: '' },
 { name: '冥王揃い', numerator: 3, rank: 2, effectId: 23, badgeImg: '' },
 { name: '紫7揃い', numerator: 10, rank: 2, effectId: 22, badgeImg: '' },
 { name: '青7揃い', numerator: 10, rank: 2, effectId: 21, badgeImg: '' },
 // ボーナス当選
 { name: 'GOGO', numerator: 240, rank: 1, effectId: 13, badgeImg: '' },
 { name: 'ハイビスカス', numerator: 240, rank: 1, effectId: 12, badgeImg: '' },
 { name: 'パトランプ', numerator: 240, rank: 1, effectId: 11, badgeImg: '' },
 // 小役
 { name: '1枚役A', numerator: 6301, rank: 0, effectId: null, badgeImg: '' },
 { name: '1枚役B', numerator: 640, rank: 0, effectId: null, badgeImg: '' },
 { name: '1枚役C', numerator: 160, rank: 0, effectId: null, badgeImg: '' },
 { name: '上段リプレイ', numerator: 8293, rank: 0, effectId: null, badgeImg: '' }, // 1/7.9
 { name: '中段リプレイ', numerator: 656, rank: 0, effectId: null, badgeImg: '' }, // 1/99.9
 { name: 'フェイクリプレイ', numerator: 100, rank: 0, effectId: null, badgeImg: '' }, // 1/655.4
 { name: '下段黄7', numerator: 3766, rank: 0, effectId: null, badgeImg: '' }, // 1/17.4
 { name: '右上がり黄7', numerator: 1135, rank: 0, effectId: null, badgeImg: '' }, // 1/57.7
 { name: '中段黄7', numerator: 70, rank: 0, effectId: null, badgeImg: '' }, // 1/936.2
 { name: 'レアSIN', numerator: 1, rank: 0, effectId: null, badgeImg: '' } // 1/65536
];

// デフォルト当選（テーブル外の場合）
export const DEFAULT_WIN: LotteryEntry = {
 name: 'ハズレ',
 numerator: 0, // 残り全て
 rank: 0,
 effectId: null,
 badgeImg: ''
};
