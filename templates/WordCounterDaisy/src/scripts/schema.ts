// src/scripts/schema.ts
import { z } from 'zod';

// Theme constants
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

// Color constants
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

// ! OneSDKから取得できなかったため手書き
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
export type ConfigUserType = z.infer<typeof configUserTypeSchema>;

// Schema for generator configuration
const generatorConfigSchema = z.object({
 title: z.string().min(1, 'タイトルは必須です'),
 theme: z.enum(themes).default('light'),
 colorMode: z.enum(colors).default('primary'),
 scale: z.number().positive().min(0.1).max(5).default(1.0)
});

// Schema for counter configuration
const counterConfigSchema = z.object({
 COUNT_MODE: z.enum(['comment', 'user', 'syoken', 'total']).default('comment'),
 TARGET_DOWN: z.number().int().min(0).default(0),
 MULTIPLIER: z.number().positive().default(1),
 PARTY: z.record(z.string(), z.string()).default({}),
 PARTY_EVENT: z.string().default(''),
 PARTY_SUCCESS: z.string().default('')
});

// Schema for a single counter set
export const counterSetSchema = z.object({
 id: z.string().min(1),
 userVisits: configUserTypeSchema,
 generator: generatorConfigSchema,
 counter: counterConfigSchema
});

// Schema for array of counter sets
export const counterSetsSchema = z.array(counterSetSchema).nonempty();

// Export the Counter Set type
export type CounterSet = z.infer<typeof counterSetSchema>;

/**
 * Creates a default counter set with sensible defaults
 * @returns A new counter set with default values
 */
export function createDefaultCounterSet(): CounterSet {
 return {
  id: `counter-${Date.now()}`,
  userVisits: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: 'platforms',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  generator: {
   title: '新しいカウンター',
   theme: 'light',
   colorMode: 'primary',
   scale: 1.0
  },
  counter: {
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
