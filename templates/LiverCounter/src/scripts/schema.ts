// src/scripts/schema.ts
import { z } from 'zod';

// service から system を除いたもの
export const serviceTypeValues = [
 'youtube',
 'twicas',
 'twitch',
 'niconama',
 'showroom',
 'bilibili',
 'mirrativ',
 'mixch',
 'twitter',
 'doneru',
 'tiktok',
 'streamlabs',
 'kick',
 'vtips',
 'external'
] as const;
export type ServiceType = (typeof serviceTypeValues)[number];

// ---

const configUserTypeSchema = z.object({
 IS_DIFF_MODE: z.boolean().default(false),
 ENABLED_SERVICES: z
  .union([z.enum(serviceTypeValues), z.literal('all'), z.literal('platforms')])
  .default('all'),
 ALLOWED_IDS: z.array(z.string()).default([]),
 ACCESS_LEVEL: z
  .number()
  .int()
  .min(1)
  .max(4)
  .refine((val) => [1, 2, 3, 4].includes(val)) // 1～4 のみ許可
  .transform((val) => val as 1 | 2 | 3 | 4) // 型を変換
  .default(1),
 IS_GIFT: z.boolean().default(false),
 KEYWORDS: z.array(z.string()).default([])
});

// ---

// Schema for counter configuration
export const TAILWIND_COLORS = [
 'default',
 'blue',
 'green',
 'red',
 'purple',
 'yellow',
 'pink',
 'gray'
] as const;
export type ColorType = (typeof TAILWIND_COLORS)[number];

// Schema for counter configuration
const countMode = [
 'none', // 手動でのカウント
 'comment', // コメント
 'user', // ユーザー
 'syoken', // ユーザー数のうち、初見さん
 'upVote', // 高評価数
 'viewer', // 視聴者数
 'gift' // ギフト金額
] as const;
export type CountType = (typeof countMode)[number];

// コンポーネントの種類
export const componentMap = [
 'BasicSquare',
 'BasicCircle',
 'capsule',
 'instaUpVote',
 'CyberNeon',
 'minimal',
 'holographic',
 'ProgressLight',
 'ProgressDark'
] as const;
export type ComponentType = (typeof componentMap)[number];

const counterConfigSchema = z.object({
 component: z.enum(componentMap).default('BasicSquare').catch('BasicSquare'), // コンポーネントの種類
 typeColor: z.enum(TAILWIND_COLORS).default('default').catch('default'), // カラーモード(optional)
 title: z.string().default('').catch(''), // カウンター名
 unit: z.string().default('').catch(''), // 単位(pt、円など)
 countMode: z.enum(countMode).default('comment').catch('comment'), // カウントモード
 targetCountdown: z.number().int().min(0).default(0).catch(0), // 1以上でカウントダウンモード
 multiplier: z.number().positive().default(1).catch(1), // 倍率(totalCounterSetがある時に使用)
 PARTY: z.record(z.string(), z.string()).default({}).catch({}), // 特定のカウントでWordParty発火
 PARTY_EVENT: z.string().default('').catch(''), // カウントアップ時にWordParty発火
 PARTY_SUCCESS: z.string().default('').catch(''), // カウントダウンモード時、カウントが0でWordParty発火
 BOT_NAME: z.string().default('info').catch('info'), // BOTの表示名
 BOT: z.record(z.string(), z.string()).default({}).catch({}), // 特定のカウントでBOTコメント
 BOT_EVENT: z.string().default('').catch(''), // カウントアップ時にBOTコメント
 BOT_SUCCESS: z.string().default('').catch('') // カウントダウンモード時、カウントが0でBOTコメント
});

// ---

// Schema統合
export const counterSetSchema = z.object({
 id: z.string().min(1),
 userVisits: configUserTypeSchema,
 counter: counterConfigSchema
});
export const counterSetsSchema = z.array(counterSetSchema).nonempty();

// ---

// componentConfig
export const componentConfigSchema = z.object({
 totalCounterSet: counterConfigSchema.nullable().default(null), // 合計値カウンターの設定
 isHorizontalLayout: z.boolean().default(true) // 並び替えモード：true=横一列, false=縦一列
});

// ---

// 型定義
export type ComponentConfig = z.infer<typeof componentConfigSchema>;
export type CounterSet = z.infer<typeof counterSetSchema>;
export type ConfigUserType = z.infer<typeof configUserTypeSchema>;
export type CounterConfig = z.infer<typeof counterConfigSchema>;

// ---

// componentConfig Default
export function createDefaultComponentConfig(): ComponentConfig {
 return {
  totalCounterSet: null,
  isHorizontalLayout: true
 };
}

// CounterSet Default
export function createDefaultCounterSet(): CounterSet {
 return {
  id: `counter-${Date.now()}`,
  userVisits: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: 'all',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  counter: {
   component: 'BasicSquare',
   typeColor: 'default',
   title: '新規カウンター',
   unit: '',
   countMode: 'comment',
   targetCountdown: 0,
   multiplier: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: '',
   BOT_NAME: '',
   BOT: {},
   BOT_EVENT: '',
   BOT_SUCCESS: ''
  }
 };
}

// CounterSets バリデーション
export function validateConfig(config: unknown): CounterSet[] {
 if (config == null) return [createDefaultCounterSet()];

 try {
  return counterSetsSchema.parse(config);
 } catch (error) {
  console.error('Config validation failed:', error);
  return [createDefaultCounterSet()];
 }
}
