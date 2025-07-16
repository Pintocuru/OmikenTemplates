// src/types/OmikujiSchema.ts
// 250716_1　displaySettings wordPartySettings の追加
import { z } from 'zod';
import { BaseSchema } from './commonSchema';
import { CommentThresholdSchema } from './ThresholdSchema';
import { CharacterEmotionSchema, CharacterSchema } from './CharacterSchema';
import { SETTINGS } from '@public/common/settings';

// データ検証とデフォルト値適用のユーティリティ関数
export function validateOmikujiData(input: unknown): OmikujiDataType {
 return OmikujiDataSchema.parse(input);
}

// Post Action関連のスキーマ

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

// Placeholder関連のスキーマ

export const PlaceholderValueSchema = z.object({
 weight: z.number().min(0).default(1).catch(1),
 content: z.string().default('').catch('')
});

export const PlaceholderSchema = z.object({
 id: z.string().default('').catch(''),
 name: z.string().default('').catch(''),
 order: z.number().min(0).default(9999).catch(9999),
 editorColor: z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .default('#3B82F6')
  .catch('#3B82F6'),
 values: z.array(PlaceholderValueSchema).default([]).catch([])
});

// Omikuji関連のスキーマ

export const OmikujiSetSchema = z.object({
 name: z.string().default('').catch(''),
 description: z.string().default('').catch(''),
 weight: z.number().min(0).default(1).catch(1),
 postActions: z.array(PostActionSchema).default([]).catch([])
});

// Rule関連のスキーマ
const BaseRuleCommonSchema = z.object({
 ...BaseSchema.shape,
 description: z.string().default('').catch(''),
 isEnabled: z.boolean().default(true).catch(true),
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
 threshold: CommentThresholdSchema.default({}),
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

// 追加: DisplaySettingsSchema
// BOTの表示部分に関わる設定
const DisplaySettingsSchema = z.object({
 // 文字・画像の大きさ指定
 displaySize: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).default('md').catch('md'),
 // 起動時表示するモード
 defaultMode: z
  .object({
   type: z.enum(['messages', 'userVisits', 'scriptGame']),
   scriptKey: z.string().optional()
  })
  .optional(),
 // 切り替えモードでの表示ON/OFF
 enabledModes: z
  .object({
   messages: z.boolean().default(true),
   userVisits: z.boolean().default(true),
   scriptGames: z.record(z.string(), z.boolean()).default({})
  })
  .default({}),
 // キャラクターコントロールパネルを表示しないか
 hideModeSwitch: z.boolean().default(false).catch(false),
 // トーストを表示するか
 toastEnabled: z.boolean().default(true).catch(true),
 // モードの自動切り替えをする秒数
 autoSwitchInterval: z.number().min(0).default(0).catch(0)
});

// WordParty設定
export const WordPartySettingsSchema = z.object({
 name: z.string().default('').catch(''),
 pattern: z.string().default('').catch('')
});

// メインデータ構造のスキーマ
export const OmikujiDataSchema = z.object({
 comments: z.record(z.string(), CommentRuleSchema).default({}).catch({}),
 timers: z.record(z.string(), TimerRuleSchema).default({}).catch({}),
 placeholders: z.record(z.string(), PlaceholderSchema).default({}).catch({}),
 scriptSettings: z.record(z.string(), z.record(z.string(), z.any())).default({}).catch({}),
 characters: z.record(z.string(), CharacterSchema).default({}).catch({}),
 displaySettings: DisplaySettingsSchema.default({}),
 wordPartySettings: z.array(WordPartySettingsSchema).default([]).catch([])
});

// 型エクスポート

export type CategoryType =
 | 'comments'
 | 'timers'
 | 'placeholders'
 | 'scriptSettings'
 | 'characters'
 | 'displaySettings'
 | 'wordPartySettings';
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>;
export type CommentRuleType = z.infer<typeof CommentRuleSchema>;
export type TimerRuleType = z.infer<typeof TimerRuleSchema>;
export type RuleType = CommentRuleType | TimerRuleType;
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>;
export type PostActionType = z.infer<typeof PostActionSchema>;
export type PlaceholderType = z.infer<typeof PlaceholderSchema>;
export type PlaceholderValueType = z.infer<typeof PlaceholderValueSchema>;
export type DisplaySettingsType = z.infer<typeof DisplaySettingsSchema>;
export type WordPartySettings = z.infer<typeof WordPartySettingsSchema>;
