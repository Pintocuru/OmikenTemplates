// src/types/ThresholdSchema.ts
// 250714_1　全編改変
import { z } from 'zod';

/**
 * 各種 Threshold
 */

// condition
export const commentThresholdCondition = ['comment', 'syoken', 'access', 'gift', 'count'] as const;
export type CommentThresholdCondition = (typeof commentThresholdCondition)[number];

export const commentThresholdConditionLabels: Record<CommentThresholdCondition, string> = {
 comment: 'チャットワード',
 syoken: '初見判定ちゃん',
 access: 'ユーザーの役職',
 gift: 'ギフト',
 count: 'チャット数'
};

export const commentThresholdConditionDescriptions: Record<CommentThresholdCondition, string> = {
 comment: 'チャットに含まれるキーワードで判定します',
 syoken: '初見ユーザー、配信の1回目コメントを判定します',
 access: '配信者・モデレーター等を判定します',
 gift: 'ギフトの種類や金額で判定します',
 count: '配信枠や個人ごとのコメント数で判定します'
};

export const CommentThresholdConditionSchema = z
 .enum(commentThresholdCondition)
 .default('comment')
 .catch('comment');

// syoken
export const syokenCondition = ['syoken', 'again', 'firstVisit'] as const;
export type SyokenCondition = (typeof syokenCondition)[number];

export const syokenConditionLabels: Record<SyokenCondition, string> = {
 syoken: '初見',
 again: '7日以上経過',
 firstVisit: '配信枠での初回'
};

export const syokenConditionDescriptions: Record<SyokenCondition, string> = {
 syoken: '初回訪問(わんコメにデータのない)ユーザー',
 again: '前回の訪問から7日以上経過したユーザー',
 firstVisit: 'この配信枠で初めてコメントするユーザー'
};

export const SyokenConditionSchema = z.enum(syokenCondition).default('syoken').catch('syoken');

// access
export const accessCondition = [
 'basic',
 'member',
 'subscriber',
 'premium',
 'moderator',
 'owner'
] as const;
export type AccessCondition = (typeof accessCondition)[number];

export const accessConditionLabels: Record<AccessCondition, string> = {
 basic: '一般ユーザー',
 member: 'メンバーシップ加入者',
 subscriber: 'サブスク登録者',
 premium: 'プレミアム会員',
 moderator: 'モデレーター',
 owner: '配信者'
};

export const accessConditionDescriptions: Record<AccessCondition, string> = {
 basic: '以下どれにも該当しないユーザー',
 member: 'Youtube等のメンバーシップ',
 subscriber: 'Twitchのサブスク加入者',
 premium: 'ニコ生プレミアム会員',
 moderator: 'モデレーターの権限を持つユーザー',
 owner: '配信者本人'
};

export const AccessConditionSchema = z.enum(accessCondition).default('basic').catch('basic');

// gift
export const giftCondition = [
 'all',
 'blue',
 'lightBlue',
 'green',
 'yellow',
 'orange',
 'pink',
 'red',
 'purple'
] as const;
export type GiftCondition = (typeof giftCondition)[number];

export const giftConditionLabels: Record<GiftCondition, string> = {
 all: '全て',
 blue: '200円未満',
 lightBlue: '200-499円',
 green: '500-999円',
 yellow: '1000-1999円',
 orange: '2000-4999円',
 pink: '5000-9999円',
 red: '10000円-19999円',
 purple: '20000円以上'
};

export const giftConditionDescriptions: Record<GiftCondition, string> = {
 all: 'メンバー加入を含む全てのギフト',
 blue: '200円未満の小額ギフト',
 lightBlue: '200円以上500円未満のギフト',
 green: '500円以上1000円未満のギフト',
 yellow: '1000円以上2000円未満のギフト',
 orange: '2000円以上5000円未満のギフト',
 pink: '5000円以上10000円未満のギフト',
 red: '10000円以上20000円未満の高額ギフト',
 purple: '20000円以上の超高額ギフト'
};

export const GiftConditionSchema = z.enum(giftCondition).default('all').catch('all');

// count
export const countComparisonCondition = ['min', 'max', 'equal', 'loop'] as const;
export type CountComparisonCondition = (typeof countComparisonCondition)[number];

export const countComparisonConditionLabels: Record<CountComparisonCondition, string> = {
 min: '数値以下',
 max: '数値以上',
 equal: '等しい',
 loop: 'ループ'
};

export const countComparisonConditionDescriptions: Record<CountComparisonCondition, string> = {
 min: '指定した数値以下の場合に条件を満たします',
 max: '指定した数値以上の場合に条件を満たします',
 equal: '指定した数値と等しい場合に条件を満たします',
 loop: '指定した数値の倍数の場合に条件を満たします'
};

export const countUnitCondition = ['lc', 'tc'] as const;
export type CountUnitCondition = (typeof countUnitCondition)[number];

export const countUnitConditionLabels: Record<CountUnitCondition, string> = {
 lc: '配信枠のコメント数',
 tc: '総数の個人コメント数'
};

export const countUnitConditionDescriptions: Record<CountUnitCondition, string> = {
 lc: 'この配信枠でのコメント数で判定します',
 tc: '全配信を通じたユーザーの総コメント数で判定します'
};

// ServiceMeta いつか使うかもしれないので
export const serviceMetaCondition = ['viewer', 'upVote'] as const;
export type ServiceMetaCondition = (typeof serviceMetaCondition)[number];
export const serviceMetaConditionLabels: Record<ServiceMetaCondition, string> = {
 viewer: '現在の枠の視聴ユーザー数',
 upVote: '現在の枠の高評価数'
};

export const CountConditionSchema = z.object({
 comparison: z.enum(countComparisonCondition).default('min').catch('min'),
 unit: z.enum(countUnitCondition).default('lc').catch('lc'),
 value: z.number().min(0).default(1).catch(1)
});
export type CountConditionType = z.infer<typeof CountConditionSchema>;

/**
 * Comment Threshold
 */
export const CommentThresholdSchema = z.object({
 conditions: z.array(CommentThresholdConditionSchema).default([]).catch([]),
 syoken: z.array(SyokenConditionSchema).default([]).catch([]),
 access: z.array(AccessConditionSchema).default([]).catch([]),
 gift: z.array(GiftConditionSchema).default([]).catch([]),
 count: CountConditionSchema.default({}),
 comment: z.array(z.string()).default([]).catch([])
});
export type CommentThresholdType = z.infer<typeof CommentThresholdSchema>;

/**
 * ConfigUser Threshold
 */

// condition
export const configUserCondition = ['user', 'access', 'gift', 'comment'] as const;
export type ConfigUserCondition = (typeof configUserCondition)[number];

export const ConfigUserConditionLabels: Record<ConfigUserCondition, string> = {
 user: 'ユーザー',
 access: 'ユーザーの役職',
 gift: 'ギフト',
 comment: 'コメントワード'
};

export const ConfigUserConditionDescriptions: Record<ConfigUserCondition, string> = {
 user: '特定のユーザーIDで判定します',
 access: 'ユーザーの役職・権限レベルで判定します',
 gift: 'ギフトの種類や金額で判定します',
 comment: 'コメントに含まれるキーワードで判定します'
};

export const ConfigUserConditionSchema = z.enum(configUserCondition).catch('comment');

// ConfigUserThreshold のスキーマ本体
export const ConfigUserThresholdSchema = z.object({
 conditions: z.array(ConfigUserConditionSchema).default([]).catch([]),
 user: z.array(z.string()).default([]).catch([]), // "!ID" による除外はバリデーション側で対応
 access: z.array(AccessConditionSchema).default([]).catch([]),
 gift: z.array(GiftConditionSchema).default([]).catch([]),
 comment: z.array(z.string()).default([]).catch([])
});
export type ConfigUserThresholdType = z.infer<typeof ConfigUserThresholdSchema>;
