// src/types/OmikujiTypesSchema.ts
// 250711_1　.default('')の導入とデフォルト値を入れる関数の削除
import { z } from 'zod';
import { SETTINGS } from '@public/common/settings';

// ======================
// ユーティリティ関数
// ======================

// ID生成ユーティリティ
export const generateId = () => {
 return '' + Date.now();
};

// ======================
// データ検証とデフォルト値適用のユーティリティ関数
// ======================
export function validateOmikujiData(input: unknown): OmikujiDataType {
 return OmikujiDataSchema.parse(input);
}

// ======================
// Character関連のスキーマ
// ======================

const EmotionIcons = [
 'default',
 'happy',
 'excited',
 'laughing',
 'blushing',
 'surprised',
 'sad',
 'angry',
 'thinking',
 'wink',
 'singing',
 'sleepy'
] as const;

const CharacterEmotionSchema = z.enum(EmotionIcons);

export const CharacterColorSchemeSchema = z.object({
 nameColor: z.string().default('#000000').catch('#000000'),
 textColor: z.string().default('#000000').catch('#000000'),
 backgroundColor: z.string().default('#FFFFFF').catch('#FFFFFF')
});

export const CharacterImageSetSchema = z.object({
 default: z.string().default('').catch(''),
 happy: z.string().default('').catch(''),
 excited: z.string().default('').catch(''),
 laughing: z.string().default('').catch(''),
 blushing: z.string().default('').catch(''),
 surprised: z.string().default('').catch(''),
 sad: z.string().default('').catch(''),
 angry: z.string().default('').catch(''),
 thinking: z.string().default('').catch(''),
 wink: z.string().default('').catch(''),
 singing: z.string().default('').catch(''),
 sleepy: z.string().default('').catch('')
});

export const CharacterPresetSchema = z.object({
 id: z.string().default('').catch(''),
 name: z.string().default('').catch(''),
 description: z.string().default('').catch(''),
 version: z.string().default('1.0.0').catch('1.0.0'),
 author: z.string().default('').catch(''),
 order: z.number().min(0).default(0).catch(0),
 tags: z.array(z.string().default('').catch('')).default([]).catch([]),
 url: z.string().default('').catch(''),
 path: z.string().default('').catch(''),
 isIconDisplay: z.boolean().default(true).catch(true),
 displayName: z.string().default('').catch(''),
 frameId: z.union([z.string(), z.null()]).default(null).catch(null),
 color: CharacterColorSchemeSchema,
 image: CharacterImageSetSchema
});

// ======================
// Threshold関連のスキーマ
// ======================

export const CommentConditionTypesSchema = z
 .enum(['syoken', 'access', 'gift', 'count', 'comment'])
 .default('syoken')
 .catch('syoken');

export const SyokenConditionSchema = z
 .enum(['1', '2', '3'])
 .transform((val) => parseInt(val))
 .default('1')
 .catch(1);

export const AccessConditionSchema = z
 .enum(['1', '2', '3', '4'])
 .transform((val) => parseInt(val))
 .default('1')
 .catch(1);

export const GiftConditionSchema = z
 .enum(['0', '1', '2', '3', '4', '5', '6', '7', '8'])
 .transform((val) => parseInt(val))
 .default('0')
 .catch(0);

export const CountConditionSchema = z.object({
 comparison: z.enum(['min', 'max', 'equal', 'loop']).default('min').catch('min'),
 unit: z.enum(['lc', 'tc']).default('lc').catch('lc'),
 value: z.number().min(0).default(1).catch(1)
});

export const CommentThresholdSchema = z.object({
 conditions: z.array(CommentConditionTypesSchema).default([]).catch([]),
 syoken: z.array(SyokenConditionSchema).default([]).catch([]),
 access: z.array(AccessConditionSchema).default([]).catch([]),
 gift: z.array(GiftConditionSchema).default([]).catch([]),
 count: CountConditionSchema,
 comment: z.array(z.string().default('').catch('')).default([]).catch([])
});

// ======================
// Post Action関連のスキーマ
// ======================

export const PostActionSchema = z.object({
 characterKey: z.string().default('').catch(''),
 iconKey: CharacterEmotionSchema.default('default').catch('default'),
 delaySeconds: z
  .number()
  .min(SETTINGS.basicDelaySeconds * -1)
  .default(0)
  .catch(0),
 wordParty: z.string().default('').catch(''),
 messageContent: z.string().default('').catch(''),
 messageToast: z.string().default('').catch('')
});

export const PostActionWordPartySchema = z.object({
 delaySeconds: z.number().min(0).default(0).catch(0),
 wordParty: z.string().default('').catch('')
});

// ======================
// Placeholder関連のスキーマ
// ======================

export const PlaceholderValueSchema = z.object({
 weight: z.number().min(0).default(1).catch(1),
 content: z.string().default('').catch('')
});

export const PlaceholderSchema = z.object({
 id: z.string().default('').catch(''),
 name: z.string().default('').catch(''),
 order: z.number().min(0).default(9999).catch(9999),
 values: z.array(PlaceholderValueSchema).default([]).catch([])
});

// ======================
// Omikuji関連のスキーマ
// ======================
export const OmikujiSetSchema = z.object({
 name: z.string().default('').catch(''),
 description: z.string().default('').catch(''),
 weight: z.number().min(0).default(1).catch(1),
 postActions: z.array(PostActionSchema).default([]).catch([])
});

// ======================
// Rule関連のスキーマ
// ======================
const BaseRuleCommonSchema = z.object({
 id: z.string().default('').catch(''),
 name: z.string().default('').catch(''),
 description: z.string().default('').catch(''),
 isEnabled: z.boolean().default(true).catch(true),
 order: z.number().min(0).default(0).catch(0),
 editorColor: z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .default('#3B82F6')
  .catch('#3B82F6'),
 omikuji: z.array(OmikujiSetSchema).default([]).catch([])
});

export const CommentRuleSchema = z.object({
 ...BaseRuleCommonSchema.shape,
 ruleType: z.literal('comments').default('comments').catch('comments'),
 threshold: CommentThresholdSchema,
 scriptId: z.union([z.string(), z.null()]).default(null).catch(null),
 scriptParams: z
  .union([z.record(z.any()), z.null()])
  .default(null)
  .catch(null)
});

export const TimerRuleSchema = z.object({
 ...BaseRuleCommonSchema.shape,
 ruleType: z.literal('timers').default('timers').catch('timers'),
 intervalSeconds: z
  .number()
  .min(5)
  .max(60 * 60)
  .default(60 * 5)
  .catch(60 * 5),
 isBaseZero: z.boolean().default(false).catch(false)
});

// ======================
// メインデータ構造のスキーマ
// ======================
export const OmikujiDataSchema = z.object({
 comments: z.record(z.string(), CommentRuleSchema).default({}).catch({}),
 timers: z.record(z.string(), TimerRuleSchema).default({}).catch({}),
 placeholders: z.record(z.string(), PlaceholderSchema).default({}).catch({}),
 scriptSettings: z.record(z.string(), z.record(z.string(), z.any())).default({}).catch({}),
 characters: z.record(z.string(), CharacterPresetSchema).default({}).catch({})
});

// ======================
// 型エクスポート
// ======================
export type CategoryType = 'comments' | 'timers' | 'placeholders' | 'scriptSettings' | 'characters';
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>;
export type CommentRuleType = z.infer<typeof CommentRuleSchema>;
export type TimerRuleType = z.infer<typeof TimerRuleSchema>;
export type RuleType = CommentRuleType | TimerRuleType;
export type PlaceholderValueType = z.infer<typeof PlaceholderValueSchema>;
export type PlaceholderType = z.infer<typeof PlaceholderSchema>;
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>;
export type PostActionType = z.infer<typeof PostActionSchema>;
export type CommentThresholdType = z.infer<typeof CommentThresholdSchema>;
export type CountConditionType = z.infer<typeof CountConditionSchema>;
export type CharacterPresetType = z.infer<typeof CharacterPresetSchema>;
export type CharacterColorSchemeType = z.infer<typeof CharacterColorSchemeSchema>;
export type CharacterImageSetType = z.infer<typeof CharacterImageSetSchema>;
export type CharacterImageType = z.infer<typeof CharacterEmotionSchema>;
export type CharacterEmotionType = z.infer<typeof CharacterEmotionSchema>;
