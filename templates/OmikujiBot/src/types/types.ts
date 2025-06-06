// src/types.ts
import { ConfigUserType } from '@common/CommonSchema';
import { UserVisitType } from '@common/subscribe/GetUserVisits';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { BaseBadge } from '@onecomme.com/onesdk/types/BaseResponse';

// UserVisitType の拡張
export interface ServiceVisitGodType extends UserVisitType, GodStatus {}

// BotMessage Commentを大幅に略したもの
export type BotMessage = {
 id: string; // 一意のid
 name: string; // 表示する名前
 profileImage: string | null; // アイコン
 timestamp: string; // 投稿日時
 comment: string; // コメント
 isToast: boolean; // 通常表示かトースト表示か
};

// Comment の拡張
export type CommentBot = Comment & {
 godStatus?: GodStatus; // コメントにステータスを乗せる
 hitEntry: LotteryEntry; // その回の当選フラグ
};

// 現在のステータス
export interface GodStatus {
 rank: number; // 現在のランク
 effectId: number | null; // 現在の効果枠ID
 badges: BaseBadge[]; // 所持バッジ（確定役）
}

// 抽選テーブル
export interface LotteryEntry {
 name: string;
 numerator: number;
 rank: number;
 effectId: number | null;
 badgeImg: string; // base64画像
}

// ---

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG: ConfigUserType;
 }
}
