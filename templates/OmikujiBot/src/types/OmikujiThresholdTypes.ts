// src/types/OmikujiThresholdTypes.ts
// 250714_1 AccessCondition の変更

// ConfigUserの条件型
export interface ConfigUserThreshold {
 conditions: ConfigUserConditionType[];
 user: string[]; // 通すユーザーIDリスト(!IDでネガティブ)
 access: AccessConditionArray; // ユーザーの役職
 gift: GiftConditionArray; // ギフトの有無
 comment: string[]; // コメントを参照する
}

// condition選択用
export const ConfigUserConditionTypes = {
 USER: 'user',
 ACCESS: 'access',
 GIFT: 'gift',
 COMMENT: 'comment'
} as const;
export type ConfigUserConditionType =
 (typeof ConfigUserConditionTypes)[keyof typeof ConfigUserConditionTypes];

// ---

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

// ---

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
 BASIC: 'basic', // 無料の一般ユーザー
 MEMBER: 'member', // メンバーシップ加入者
 SUBSCRIBER: 'subscriber', // サブスク登録者
 PREMIUM: 'premium', // プレミアム会員
 MODERATOR: 'moderator', // モデレーター
 OWNER: 'owner' // 配信者かつ管理者
} as const;
export type AccessCondition = (typeof AccessCondition)[keyof typeof AccessCondition];
export type AccessConditionArray = AccessCondition[];
export const AccessConditionLabels: Record<AccessCondition, string> = {
 basic: '一般ユーザー',
 member: 'メンバーシップ加入者',
 subscriber: 'サブスク登録者',
 premium: 'プレミアム会員',
 moderator: 'モデレーター',
 owner: '配信者'
};

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
