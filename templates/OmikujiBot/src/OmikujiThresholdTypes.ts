// src/types/OmikujiThresholdTypes.ts
///////////////////////////////////
// Threshold
///////////////////////////////////

// commentの条件型
export interface CommentThreshold {
 conditions: CommentConditionType[];
 syoken: SyokenConditionArray; // 初見・久しぶり
 access: AccessConditionArray; // ユーザーの役職
 gift: GiftConditionArray; // ギフトの有無
 count: CountCondition; // 数値を参照する
 comment: string[]; // コメントを参照する
}

// condition選択用
export const CommentConditionTypes = {
 SYOKEN: 'syoken',
 ACCESS: 'access',
 GIFT: 'gift',
 COUNT: 'count',
 COMMENT: 'comment'
} as const;
export type CommentConditionType =
 (typeof CommentConditionTypes)[keyof typeof CommentConditionTypes];

// syoken:初見・コメント履歴の種別
export const SyokenCondition = {
 SYOKEN: 1, // 初見
 AGAIN: 2, // 前回のコメントから7日以上経過
 HI: 3 // 上記以外の、その配信枠で1回目のコメント
} as const;
export type SyokenCondition = (typeof SyokenCondition)[keyof typeof SyokenCondition];
export type SyokenConditionArray = SyokenCondition[];

// access:ユーザーの役職 1:一般ユーザー/2:メンバー/3:モデレーター/4:管理者
export const AccessCondition = {
 GUEST: 1,
 MEMBER: 2,
 MODERATOR: 3,
 ADMIN: 4
} as const;
export type AccessCondition = (typeof AccessCondition)[keyof typeof AccessCondition];
export type AccessConditionArray = AccessCondition[];

// gift:ギフトのRank
export const GiftCondition = {
 All: 0, // 全て(メンバー加入含む)
 Blue: 1, // 200円未満
 LightBlue: 2, // 200円〜499円
 Green: 3, // 500円〜999円
 Yellow: 4, // 1,000円〜1,999円
 Orange: 5, // 2,000円〜4,999円
 Pink: 6, // 5,000円〜9,999円
 Red: 7, // 10,000円以上
 Purple: 8 // 20,000円以上
} as const;
export type GiftCondition = (typeof GiftCondition)[keyof typeof GiftCondition];
export type GiftConditionArray = GiftCondition[];

// count:数値を参照する
export interface CountCondition {
 comparison:
  | 'min' // 数値以下
  | 'max' // 数値以上
  | 'equal' // 等しい
  | 'loop'; // 数値をvalueで割った数;
 unit:
  | 'lc' // 配信枠のコメント数(プラグインで独自に付与.lc)
  | 'tc'; // 総数の個人コメ数(userData.tc)
 value: number;
}

// -- 以下不要かもしれない

type ComparisonType =
 | 'min' // 数値以下
 | 'max' // 数値以上
 | 'equal' // 等しい
 | 'loop'; // 数値をvalueで割った数

// match:文字列を参照する
export interface MatchCondition {
 target:
  | 'comment' // コメント(comment.data.comment)
  | 'name' // 名前(comment.data.name)
  | 'displayName'; // ニックネーム(comment.data.displayName)
 value: string[]; // 検索ワード
}

// Timerの条件型
export interface TimerThreshold {
 conditionType: TimerConditionType;
 isNot?: boolean; // 条件を反転させる
}
export type TimerConditionType = 'draws';

// metaの条件型
export interface MetaThreshold {
 conditionType: MetaConditionType;
 isNot?: boolean; // 条件を反転させる
 metaCount?: MetaCountCondition; // 数値を参照する
 dynamic?: MetaDynamicCondition; // 数値の変化しやすい、高評価数・閲覧数を参照
}

export type MetaConditionType = 'draws' | 'metaCount' | 'dynamic';

// metaCount:数値を参照する
export interface MetaCountCondition {
 comparison: ComparisonType;
 unit:
  | 'streamDuration' // 配信開始時間から経過した時間(分)
  | 'totalGifts' // 配信枠でのギフト総額
  | 'followers'; // フォロワー数
 value: number;
}

// dynamic:高評価数・閲覧数を参照
export interface MetaDynamicCondition {
 comparison:
  | 'min' // 数値以下
  | 'max' // 数値以上
  | 'different' // 前回の数値とは異なる
  | 'increasing' // 前回の数値よりも大きい
  | 'newMaximum'; // 当配信の最大値よりも大きい
 unit:
  | 'upVote' // 高評価数
  | 'viewer'; // 閲覧数
 value: number;
}
