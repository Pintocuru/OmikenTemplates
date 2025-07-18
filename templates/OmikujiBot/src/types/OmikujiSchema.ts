// src/types/OmikujiSchema.ts
// 250716_2 DisplaySettingsSchema.ts の分離
import { z } from 'zod';
import { BaseSchema } from './commonSchema';
import {
 CommentThresholdSchema,
 countUnitCondition,
 countUnitConditionLabels,
 serviceMetaCondition,
 serviceMetaConditionLabels
} from './ThresholdSchema';
import { CharacterEmotionSchema, CharacterSchema } from './CharacterSchema';
import { ScriptSettingsSchema } from './ScriptSettingsSchema';
import { DisplaySettingsSchema } from './DisplaySettingsSchema';
import { SETTINGS } from '@public/common/settings';
import { MessageCircle, Timer, Hash, Settings, Users, Monitor, ListChecks } from 'lucide-vue-next';

// データ検証とデフォルト値適用のユーティリティ関数
export function validateOmikujiData(input: unknown): OmikujiDataType {
 return OmikujiDataSchema.parse(input);
}

// Placeholder

// defaultのプレースホルダー(user/Commentのmeta/ServiceMeta)
export const defaultPlaceholders = [
 'user',
 ...countUnitCondition,
 ...serviceMetaCondition
] as const;
export type DefaultPlaceholders = (typeof defaultPlaceholders)[number];

export const defaultPlaceholdersLabels: Record<DefaultPlaceholders, string> = {
 user: 'コメントしたユーザー',
 ...countUnitConditionLabels,
 ...serviceMetaConditionLabels
};

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

// PostAction
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

// Omikuji
export const OmikujiSetSchema = z.object({
 name: z.string().default('').catch(''),
 description: z.string().default('').catch(''),
 weight: z.number().min(0).default(1).catch(1),
 postActions: z.array(PostActionSchema).default([]).catch([])
});

// Rule
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

// CommentRule
export const CommentRuleSchema = z.object({
 ...BaseRuleCommonSchema.shape,
 ruleType: z.literal('comments').default('comments').catch('comments'),
 threshold: CommentThresholdSchema.default({}),
 scriptId: z.union([z.string(), z.null()]).default(null).catch(null),
 scriptParams: z.record(z.any()).nullable().default(null).catch(null)
});

// TimerRule
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

// WordParty設定
export const WordPartySettingsSchema = z.object({
 name: z.string().default('').catch(''),
 pattern: z.string().default('').catch('')
});

// CategoryType categoryLabels
export const categoryType = [
 'comments',
 'timers',
 'placeholders',
 'scriptSettings',
 'characters',
 'displaySettings',
 'wordPartySettings'
] as const;
export type CategoryType = (typeof categoryType)[number];

export const categoryLabels: Record<CategoryType, { label: string; icon: any }> = {
 comments: { label: 'コメントルール', icon: MessageCircle },
 timers: { label: 'タイマールール', icon: Timer },
 placeholders: { label: 'プレースホルダー', icon: Hash },
 scriptSettings: { label: 'スクリプト設定', icon: Settings },
 characters: { label: 'キャラクター', icon: Users },
 displaySettings: { label: '表示設定', icon: Monitor },
 wordPartySettings: { label: 'WordPartyリスト設定', icon: ListChecks }
};

// メインデータ構造のスキーマ
export const OmikujiDataSchema = z.object({
 comments: z.record(z.string(), CommentRuleSchema).default({}).catch({}),
 timers: z.record(z.string(), TimerRuleSchema).default({}).catch({}),
 placeholders: z.record(z.string(), PlaceholderSchema).default({}).catch({}),
 scriptSettings: ScriptSettingsSchema.default({}).catch({}),
 characters: z.record(z.string(), CharacterSchema).default({}).catch({}),
 displaySettings: DisplaySettingsSchema.catch(DisplaySettingsSchema.parse({})),
 wordPartySettings: z.array(WordPartySettingsSchema).default([]).catch([])
});

// 型エクスポート
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
