// src/types/OmikujiTypesSchema.ts
import { z } from 'zod';

// ======================
// デフォルト値生成関数
// ======================

// ID生成ユーティリティ
export const generateId = () => {
 return '' + Date.now();
};

// デフォルトキャラクターを作成
export const createDefaultCharacter = () => ({
 id: '',
 name: '',
 description: '',
 version: '1.0.0',
 author: '',
 order: 0,
 tags: [],
 url: '',
 path: '',
 isIconDisplay: true,
 displayName: '',
 frameId: null,
 color: {
  nameColor: '#000000',
  textColor: '#000000',
  backgroundColor: '#FFFFFF'
 },
 image: {
  default: '',
  happy: '',
  excited: '',
  laughing: '',
  blushing: '',
  surprised: '',
  sad: '',
  angry: '',
  thinking: '',
  wink: '',
  singing: '',
  sleepy: ''
 }
});

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
 postActions: []
});

export const createDefaultPlaceholderValue = () => ({
 weight: 1,
 content: ''
});

export const createDefaultPlaceholder = () => ({
 id: generateId(),
 name: '',
 order: 9999,
 values: [createDefaultPlaceholderValue()]
});

export const createDefaultCommentRule = () => ({
 id: generateId(),
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
 id: generateId(),
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

export const createDefaultCharacterColorScheme = () => ({
 nameColor: '#000000',
 textColor: '#000000',
 backgroundColor: '#FFFFFF'
});

export const createDefaultCharacterImageSet = () => ({
 default: ''
});

export const createDefaultCharacterPreset = () => ({
 id: generateId(),
 name: '',
 description: '',
 version: '1.0.0',
 author: '',
 order: 0,
 tags: [],
 url: '',
 path: '',
 isIconDisplay: true,
 displayName: '',
 frameId: null,
 color: createDefaultCharacterColorScheme(),
 image: createDefaultCharacterImageSet()
});

export const createDefaultOmikujiData = () => ({
 comments: {},
 timers: {},
 placeholders: {},
 scriptSettings: {},
 characters: {}
});

// ======================
// データ検証とデフォルト値適用のユーティリティ関数
// ======================
export function validateOmikujiData(input: unknown): OmikujiDataType {
 return OmikujiDataSchema.parse(input);
}

// ======================
// Character関連のスキーマ
// ======================

export const CharacterEmotionSchema = z.enum([
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
]);

export const CharacterColorSchemeSchema = z
 .object({
  nameColor: z.string().catch('#000000'),
  textColor: z.string().catch('#000000'),
  backgroundColor: z.string().catch('#FFFFFF')
 })
 .catch(createDefaultCharacterColorScheme);

export const CharacterImageSetSchema = z
 .object({
  default: z.string().catch(''),
  happy: z.string().optional(),
  excited: z.string().optional(),
  laughing: z.string().optional(),
  blushing: z.string().optional(),
  surprised: z.string().optional(),
  sad: z.string().optional(),
  angry: z.string().optional(),
  thinking: z.string().optional(),
  wink: z.string().optional(),
  singing: z.string().optional(),
  sleepy: z.string().optional()
 })
 .catch(createDefaultCharacterImageSet);

export const CharacterPresetSchema = z
 .object({
  id: z.string().catch(''),
  name: z.string().catch(''),
  description: z.string().catch(''),
  version: z.string().catch('1.0.0'),
  author: z.string().optional(),
  order: z.number().min(0).catch(0),
  tags: z.array(z.string().catch('')).catch([]),
  url: z.string().optional(),
  path: z.string().optional(),
  isIconDisplay: z.boolean().catch(true),
  displayName: z.string().optional(),
  frameId: z.union([z.string(), z.null()]).catch(null),
  color: CharacterColorSchemeSchema,
  image: CharacterImageSetSchema
 })
 .catch(createDefaultCharacterPreset);

// ======================
// Threshold関連のスキーマ
// ======================

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

// ======================
// Post Action関連のスキーマ
// ======================

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

// ======================
// Placeholder関連のスキーマ
// ======================

export const PlaceholderValueSchema = z
 .object({
  weight: z.number().min(0).catch(1),
  content: z.string().catch('')
 })
 .catch(createDefaultPlaceholderValue);

export const PlaceholderSchema = z
 .object({
  id: z.string().catch(''),
  name: z.string().catch(''),
  order: z.number().min(0).catch(0),
  values: z.array(PlaceholderValueSchema).catch([createDefaultPlaceholderValue()])
 })
 .catch(createDefaultPlaceholder);

// ======================
// Omikuji関連のスキーマ
// ======================
export const OmikujiSetSchema = z
 .object({
  name: z.string().catch(''),
  description: z.string().catch(''),
  weight: z.number().min(0).catch(1),
  postActions: z.array(PostActionSchema).catch([])
 })
 .catch(createDefaultOmikujiSet);

// ======================
// Rule関連のスキーマ
// ======================
const BaseRuleCommonSchema = z.object({
 id: z.string().catch(''),
 name: z.string().catch(''),
 description: z.string().catch(''),
 isEnabled: z.boolean().catch(true),
 order: z.number().min(0).catch(0),
 editorColor: z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .catch('#3B82F6'),
 scriptId: z.union([z.string(), z.null()]).catch(null),
 scriptParams: z.union([z.record(z.any()), z.null()]).catch(null),
 omikuji: z.array(OmikujiSetSchema).catch([createDefaultOmikujiSet()])
});

export const CommentRuleSchema = z
 .object({
  ...BaseRuleCommonSchema.shape,
  ruleType: z.literal('comments').catch('comments'),
  threshold: CommentThresholdSchema
 })
 .catch(createDefaultCommentRule);

export const TimerRuleSchema = z
 .object({
  ...BaseRuleCommonSchema.shape,
  ruleType: z.literal('timers').catch('timers'),
  intervalSeconds: z.number().min(1).catch(60)
 })
 .catch(createDefaultTimerRule);

// ======================
// メインデータ構造のスキーマ
// ======================
export const OmikujiDataSchema = z
 .object({
  comments: z.record(z.string(), CommentRuleSchema).catch({}),
  timers: z.record(z.string(), TimerRuleSchema).catch({}),
  placeholders: z.record(z.string(), PlaceholderSchema).catch({}),
  scriptSettings: z.record(z.string(), z.record(z.string(), z.any())).catch({}),
  characters: z.record(z.string(), CharacterPresetSchema).catch({})
 })
 .catch(createDefaultOmikujiData);

// ======================
// 型エクスポート
// ======================
export type CategoryType = 'comments' | 'timers' | 'placeholders' | 'scriptSettings' | 'characters';
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>;
export type CommentRuleType = z.infer<typeof CommentRuleSchema>;
export type TimerRuleType = z.infer<typeof TimerRuleSchema>;
export type PlaceholderValueType = z.infer<typeof PlaceholderValueSchema>;
export type PlaceholderType = z.infer<typeof PlaceholderSchema>;
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>;
export type PostActionType = z.infer<typeof PostActionSchema>;
export type CommentThresholdType = z.infer<typeof CommentThresholdSchema>;
export type CountConditionType = z.infer<typeof CountConditionSchema>;
export type CharacterPresetType = z.infer<typeof CharacterPresetSchema>;
export type CharacterColorSchemeType = z.infer<typeof CharacterColorSchemeSchema>;
export type CharacterImageSetType = z.infer<typeof CharacterImageSetSchema>;
export type CharacterEmotionType = z.infer<typeof CharacterEmotionSchema>;
