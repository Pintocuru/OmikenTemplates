// src/scripts/schema.ts
import { z } from 'zod';

// Theme constants
// TODO: commonにDaisyUi用の定義を新規作成する
export const themes = [
 'light',
 'dark',
 'cupcake',
 'bumblebee',
 'emerald',
 'corporate',
 'synthwave',
 'retro',
 'cyberpunk',
 'valentine',
 'halloween',
 'garden',
 'forest',
 'aqua',
 'lofi',
 'pastel',
 'fantasy',
 'wireframe',
 'black',
 'luxury',
 'dracula',
 'cmyk',
 'autumn',
 'business',
 'acid',
 'lemonade',
 'night',
 'coffee',
 'winter',
 'dim',
 'nord',
 'sunset',
 'caramellatte',
 'abyss',
 'silk'
] as const;
export type ThemeType = (typeof themes)[number];

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
 'external',
 'system'
] as const;
export type ServiceType = (typeof serviceTypeValues)[number];

const configUserTypeSchema = z.object({
 IS_DIFF_MODE: z.boolean().default(false),
 ENABLED_SERVICES: z
  .union([z.literal('all'), z.literal('platforms'), z.enum(serviceTypeValues)])
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

// Schema for counter configuration
const counterConfigSchema = z.object({
 title: z.string().min(1, 'カウンター'),
 // TODO: 新規でmeta:「upVote、viewer」追加、Totalはトップで新規追加するのでここでは消す
 COUNT_MODE: z.enum(['comment', 'user', 'syoken']).default('comment'),
 TARGET_DOWN: z.number().int().min(0).default(0),
 MULTIPLIER: z.number().positive().default(1),
 PARTY: z.record(z.string(), z.string()).default({}),
 PARTY_EVENT: z.string().default(''),
 PARTY_SUCCESS: z.string().default('')
});

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
 // TODO: やっぱりテーマカラーは統一したい
 theme: z.enum(themes).default('light'),
 isTotalCounter: z.boolean().default(false), // 合計したカウンターを用意するか
 isHorizontalLayout: z.boolean().default(true) // 並び替えモード：true=横一列, false=縦一列
 // title　合計値カウンターのタイトル(今日のランチ代とか)
 // unit: 合計値カウンターの単位(円とか)
});

// ---

// 型定義
export type ComponentConfig = z.infer<typeof componentConfigSchema>;
export type CounterSet = z.infer<typeof counterSetSchema>;
export type ConfigUserType = z.infer<typeof configUserTypeSchema>;
export type CounterConfig = z.infer<typeof counterConfigSchema>;

/**
 * Creates a default counter set with sensible defaults
 * @returns A new counter set with default values
 */
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
   title: 'カウンター',
   // unit: カウンターの単位(ptとか)
   COUNT_MODE: 'comment',
   TARGET_DOWN: 0,
   MULTIPLIER: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 };
}

/**
 * Validates the configuration and returns a safe default if invalid
 * @param config Configuration to validate
 * @returns Validated configuration or default if invalid
 */
export function validateConfig(config: unknown): CounterSet[] {
 if (config == null) {
  return [createDefaultCounterSet()];
 }

 try {
  return counterSetsSchema.parse(config);
 } catch (error) {
  console.error('Config validation failed:', error);
  return [createDefaultCounterSet()];
 }
}

/*


// Color constants
// TODO:colors廃止。primaryのみに。
export const colors = [
 'primary',
 'secondary',
 'accent',
 'neutral',
 'info',
 'success',
 'warning',
 'error'
] as const;
export type ColorMode = (typeof colors)[number];



*/
