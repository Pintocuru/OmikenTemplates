// src/types/OmikujiTypesSchema.ts
import { z } from 'zod';

// =============================================================================
// デフォルト値生成関数
// =============================================================================

export const createDefaultCountCondition = () => ({
 comparison: 'min' as const,
 unit: 'lc' as const,
 value: 1
});

export const createDefaultCommentThreshold = () => ({
 conditions: [],
 syoken: [],
 access: [],
 gift: [],
 count: createDefaultCountCondition(),
 comment: []
});

export const createDefaultPostAction = () => ({
 characterKey: '',
 iconKey: '',
 delaySeconds: 0,
 wordParty: '',
 messageContent: '',
 messageToast: ''
});

export const createDefaultOmikujiSet = () => ({
 name: '',
 description: '',
 weight: 1,
 placeholderIds: [],
 postActions: []
});

export const createDefaultPlaceholderSourceValue = () => ({
 weight: 1,
 content: ''
});

export const createDefaultPlaceholderSource = () => ({
 id: '',
 name: '',
 description: '',
 placeholderIds: [],
 values: [createDefaultPlaceholderSourceValue()]
});

export const createDefaultCommentRule = () => ({
 id: '',
 name: '',
 description: '',
 isEnabled: true,
 order: 0,
 editorColor: '#3B82F6',
 scriptId: null,
 scriptParams: null,
 ruleType: 'comments' as const,
 threshold: createDefaultCommentThreshold(),
 omikuji: [createDefaultOmikujiSet()]
});

export const createDefaultTimerRule = () => ({
 id: '',
 name: '',
 description: '',
 isEnabled: true,
 order: 0,
 editorColor: '#10B981',
 scriptId: null,
 scriptParams: null,
 ruleType: 'timers' as const,
 intervalSeconds: 60,
 omikuji: [createDefaultOmikujiSet()]
});

export const createDefaultOmikujiData = () => ({
 comments: {},
 timers: {},
 placeholders: {},
 scriptSettings: {}
});

// =============================================================================
// Threshold関連のスキーマ
// =============================================================================

export const CommentConditionTypesSchema = z
 .enum(['syoken', 'access', 'gift', 'count', 'comment'])
 .catch('syoken');

export const SyokenConditionSchema = z
 .enum(['1', '2', '3'])
 .transform((val) => parseInt(val))
 .catch(1);

export const AccessConditionSchema = z
 .enum(['1', '2', '3', '4'])
 .transform((val) => parseInt(val))
 .catch(1);

export const GiftConditionSchema = z
 .enum(['0', '1', '2', '3', '4', '5', '6', '7', '8'])
 .transform((val) => parseInt(val))
 .catch(0);

export const CountConditionSchema = z
 .object({
  comparison: z.enum(['min', 'max', 'equal', 'loop']).catch('min'),
  unit: z.enum(['lc', 'tc']).catch('lc'),
  value: z.number().min(0).catch(1)
 })
 .catch(createDefaultCountCondition);

export const CommentThresholdSchema = z
 .object({
  conditions: z.array(CommentConditionTypesSchema).catch([]),
  syoken: z.array(SyokenConditionSchema).catch([]),
  access: z.array(AccessConditionSchema).catch([]),
  gift: z.array(GiftConditionSchema).catch([]),
  count: CountConditionSchema,
  comment: z.array(z.string().catch('')).catch([])
 })
 .catch(createDefaultCommentThreshold);

// =============================================================================
// Post Action関連のスキーマ
// =============================================================================

export const PostActionSchema = z
 .object({
  characterKey: z.string().catch(''),
  iconKey: z.string().catch(''),
  delaySeconds: z.number().min(0).catch(0),
  wordParty: z.string().catch(''),
  messageContent: z.string().catch(''),
  messageToast: z.string().catch('')
 })
 .catch(createDefaultPostAction);

export const PostActionWordPartySchema = z
 .object({
  delaySeconds: z.number().min(0).catch(0),
  wordParty: z.string().catch('')
 })
 .catch(() => ({ delaySeconds: 0, wordParty: '' }));

// =============================================================================
// Placeholder関連のスキーマ
// =============================================================================

export const PlaceholderSourceValueSchema = z
 .object({
  weight: z.number().min(0).catch(1),
  content: z.string().catch('')
 })
 .catch(createDefaultPlaceholderSourceValue);

export const PlaceholderSourceSchema = z
 .object({
  id: z.string().catch(''),
  name: z.string().catch(''),
  description: z.string().catch(''),
  placeholderIds: z.array(z.string().catch('')).catch([]),
  values: z.array(PlaceholderSourceValueSchema).catch([createDefaultPlaceholderSourceValue()])
 })
 .catch(createDefaultPlaceholderSource);

export const PlaceholderSchema = z
 .object({
  id: z.string().catch(''),
  value: z.string().catch('')
 })
 .catch(() => ({ id: '', value: '' }));

// =============================================================================
// Omikuji関連のスキーマ
// =============================================================================

export const OmikujiSetSchema = z
 .object({
  name: z.string().catch(''),
  description: z.string().catch(''),
  weight: z.number().min(0).catch(1),
  placeholderIds: z.array(z.string().catch('')).catch([]),
  postActions: z.array(PostActionSchema).catch([])
 })
 .catch(createDefaultOmikujiSet);

// =============================================================================
// Rule関連のスキーマ
// =============================================================================

const BaseRuleCommonSchema = z.object({
 id: z.string().catch(''),
 name: z.string().catch(''),
 description: z.string().catch(''),
 isEnabled: z.boolean().catch(true),
 order: z.number().min(0).catch(0),
 editorColor: z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .catch('#3B82F6')
});

export const CommentRuleSchema = z
 .object({
  ...BaseRuleCommonSchema.shape,
  scriptId: z.union([z.string(), z.null()]).catch(null),
  scriptParams: z.union([z.record(z.any()), z.null()]).catch(null),
  ruleType: z.literal('comments').catch('comments'),
  threshold: CommentThresholdSchema,
  omikuji: z.array(OmikujiSetSchema).catch([createDefaultOmikujiSet()])
 })
 .catch(createDefaultCommentRule);

export const TimerRuleSchema = z
 .object({
  ...BaseRuleCommonSchema.shape,
  scriptId: z.union([z.string(), z.null()]).catch(null),
  scriptParams: z.union([z.record(z.any()), z.null()]).catch(null),
  ruleType: z.literal('timers').catch('timers'),
  intervalSeconds: z.number().min(1).catch(60),
  omikuji: z.array(OmikujiSetSchema).catch([createDefaultOmikujiSet()])
 })
 .catch(createDefaultTimerRule);

// =============================================================================
// メインデータ構造のスキーマ
// =============================================================================

export const OmikujiDataSchema = z
 .object({
  comments: z.record(z.string(), CommentRuleSchema).catch({}),
  timers: z.record(z.string(), TimerRuleSchema).catch({}),
  placeholders: z.record(z.string(), PlaceholderSourceSchema).catch({}),
  scriptSettings: z.record(z.string(), z.record(z.string(), z.any())).catch({})
 })
 .catch(createDefaultOmikujiData);

// =============================================================================
// 型エクスポート
// =============================================================================

export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>;
export type CommentRuleType = z.infer<typeof CommentRuleSchema>;
export type TimerRuleType = z.infer<typeof TimerRuleSchema>;
export type PlaceholderSourceType = z.infer<typeof PlaceholderSourceSchema>;
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>;
export type PostActionType = z.infer<typeof PostActionSchema>;
export type CommentThresholdType = z.infer<typeof CommentThresholdSchema>;
export type CountConditionType = z.infer<typeof CountConditionSchema>;
