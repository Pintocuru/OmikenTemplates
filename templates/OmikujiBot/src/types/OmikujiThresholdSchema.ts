// src/types/OmikujiThresholdSchema.ts
import { z } from 'zod';

// ======================
// Threshold関連のスキーマ
// ======================

// 総合
export const thresholdCommentCondition = ['comment', 'syoken', 'access', 'gift', 'count'] as const;
export type ThresholdCommentCondition = (typeof thresholdCommentCondition)[number];
export const thresholdCommentConditionLabels: Record<ThresholdCommentCondition, string> = {
 comment: 'コメントワード',
 syoken: '初見判定ちゃん',
 access: 'ユーザーの役職',
 gift: 'ギフト',
 count: 'コメント数'
};
export const ThresholdCommentConditionSchema = z
 .enum(thresholdCommentCondition)
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
 all: '全て', // 全て(メンバー加入含む)
 blue: '200円未満', // 200円未満
 lightBlue: '200-499円', // 200円〜499円
 green: '500-999円', // 500円〜999円
 yellow: '1000-1999円', // 1,000円〜1,999円
 orange: '2000-4999円', // 2,000円〜4,999円
 pink: '5000-9999円', // 5,000円〜9,999円
 red: '10000円-19999円', // 10,000円以上
 purple: '20000円-' // 20,000円以上
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

export const countUnitCondition = ['lc', 'tc'] as const;
export type CountUnitCondition = (typeof countUnitCondition)[number];
export const countUnitConditionLabels: Record<CountUnitCondition, string> = {
 lc: '配信枠のコメント数',
 tc: '総数の個人コメント数'
};

export const CountConditionSchema = z.object({
 comparison: z.enum(countComparisonCondition).default('min').catch('min'),
 unit: z.enum(countUnitCondition).default('lc').catch('lc'),
 value: z.number().min(0).default(1).catch(1)
});

export type CountConditionType = z.infer<typeof CountConditionSchema>;

export const CommentThresholdSchema = z.object({
 conditions: z.array(ThresholdCommentConditionSchema).default([]).catch([]),
 syoken: z.array(SyokenConditionSchema).default([]).catch([]),
 access: z.array(AccessConditionSchema).default([]).catch([]),
 gift: z.array(GiftConditionSchema).default([]).catch([]),
 count: CountConditionSchema.default({}),
 comment: z.array(z.string().default('').catch('')).default([]).catch([])
});
export type CommentThresholdType = z.infer<typeof CommentThresholdSchema>;
